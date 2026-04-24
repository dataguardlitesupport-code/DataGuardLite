package com.dataguardlite.app.services

import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import com.dataguardlite.app.data.AppDatabase
import com.dataguardlite.app.data.SettingsRepository
import com.dataguardlite.app.repository.UsageRepository
import com.dataguardlite.app.ui.MainActivity

class UsageMonitorService : Service() {

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var loop: Job? = null
    private val notifiedThresholds = mutableSetOf<Int>()

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        startForegroundCompat(buildNotification("Monitoring mobile data usage"))
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (loop?.isActive != true) loop = scope.launch { runLoop() }
        return START_STICKY
    }

    private suspend fun runLoop() {
        val repo = UsageRepository(applicationContext, AppDatabase.get(applicationContext).snapshotDao())
        val settings = SettingsRepository(applicationContext)
        while (scope.isActive) {
            try {
                repo.snapshotNow()
                val limit = settings.limitMbFlow.first().coerceAtLeast(1L)
                val used = repo.totalMobileMbThisMonth()
                val pct = (used / limit) * 100f
                updateOngoingNotification("%.1f / %d MB (%.0f%%)".format(used, limit, pct))
                maybeAlert(pct, settings.notificationsEnabledFlow.first())
            } catch (_: Exception) {}
            delay(15 * 60 * 1000L)
        }
    }

    private fun maybeAlert(pct: Float, enabled: Boolean) {
        if (!enabled) return
        val threshold = when {
            pct >= 100f -> 100; pct >= 90f -> 90; pct >= 75f -> 75; pct >= 50f -> 50; else -> 0
        }
        if (threshold == 0 || !notifiedThresholds.add(threshold)) return
        val nm = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        nm.notify(2000 + threshold,
            NotificationCompat.Builder(this, "alerts")
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Data usage alert")
                .setContentText("$threshold% of your monthly limit reached")
                .setAutoCancel(true).build())
    }

    private fun buildNotification(text: String): Notification {
        val pi = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        return NotificationCompat.Builder(this, "service")
            .setContentTitle("DataGuard Lite")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
            .setOngoing(true).setContentIntent(pi).build()
    }

    private fun updateOngoingNotification(text: String) {
        (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).notify(NOTIF_ID, buildNotification(text))
    }

    private fun startForegroundCompat(n: Notification) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        else startForeground(NOTIF_ID, n)
    }

    override fun onDestroy() { scope.cancel(); super.onDestroy() }

    companion object {
        const val NOTIF_ID = 1001
        fun start(ctx: Context) {
            val i = Intent(ctx, UsageMonitorService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(i)
            else ctx.startService(i)
        }
    }
}
