package com.dataguardlite.app.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.dataguardlite.app.MainActivity
import com.dataguardlite.app.R
import com.dataguardlite.app.data.SettingsStore
import com.dataguardlite.app.repository.UsageRepository
import com.dataguardlite.app.util.Formatters
import com.dataguardlite.app.util.NotificationIds
import com.dataguardlite.app.util.Permissions
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.first

class UsageMonitorService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private lateinit var repo: UsageRepository
    private lateinit var settings: SettingsStore

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        repo = UsageRepository(applicationContext)
        settings = SettingsStore(applicationContext)
        startForeground(NotificationIds.NOTIF_FOREGROUND, baseNotification("Monitoring data usage"))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        scope.launch { tick() }
        scope.launch { loop() }
        return START_STICKY
    }

    private suspend fun loop() {
        while (scope.isActive) {
            delay(15 * 60 * 1000L) // 15 minutes
            tick()
        }
    }

    private suspend fun tick() = runCatching {
        if (!Permissions.hasUsageAccess(applicationContext)) return@runCatching
        val cycleDay = settings.cycleStartDay.first()
        val limitMb = settings.limitMb.first()
        val alertsEnabled = settings.alertsEnabled.first()
        val summary = repo.loadCurrentCycle(cycleDay).getOrNull() ?: return@runCatching

        val limitBytes = limitMb * 1024L * 1024L
        val percent = Formatters.percent(summary.totalMobileBytes, limitBytes)

        updateForeground(
            "${Formatters.bytes(summary.totalMobileBytes)} of ${Formatters.bytes(limitBytes)} ($percent%)"
        )
        if (alertsEnabled) maybeAlert(percent)
    }

    private suspend fun maybeAlert(percent: Int) {
        val last = settings.lastAlertLevel.first()
        val level = when {
            percent >= 100 -> 100
            percent >= 90 -> 90
            percent >= 75 -> 75
            percent >= 50 -> 50
            else -> 0
        }
        if (level == 0 || level <= last) return
        val (id, msg) = when (level) {
            50 -> NotificationIds.NOTIF_ALERT_50 to "You've used 50% of your data."
            75 -> NotificationIds.NOTIF_ALERT_75 to "Heads up — 75% used."
            90 -> NotificationIds.NOTIF_ALERT_90 to "Almost out — 90% used."
            else -> NotificationIds.NOTIF_ALERT_100 to "Limit reached — 100% used."
        }
        showAlert(id, msg)
        settings.setLastAlertLevel(level)
    }

    private fun showAlert(id: Int, text: String) {
        if (!Permissions.hasNotificationPermission(applicationContext)) return
        val n = NotificationCompat.Builder(this, NotificationIds.CHANNEL_ALERT)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("DataGuard Lite")
            .setContentText(text)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(launchIntent())
            .build()
        runCatching { NotificationManagerCompat.from(this).notify(id, n) }
    }

    private fun baseNotification(text: String): Notification =
        NotificationCompat.Builder(this, NotificationIds.CHANNEL_MONITOR)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("DataGuard Lite")
            .setContentText(text)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setContentIntent(launchIntent())
            .build()

    private fun updateForeground(text: String) {
        if (!Permissions.hasNotificationPermission(applicationContext)) return
        runCatching {
            NotificationManagerCompat.from(this)
                .notify(NotificationIds.NOTIF_FOREGROUND, baseNotification(text))
        }
    }

    private fun launchIntent(): PendingIntent {
        val intent = Intent(this, MainActivity::class.java)
            .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        return PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }

    companion object {
        fun start(context: Context) {
            val i = Intent(context, UsageMonitorService::class.java)
            runCatching {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                    context.startForegroundService(i)
                } else context.startService(i)
            }
        }
    }
}
