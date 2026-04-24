package com.dataguardlite.app.utils

import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.flow.first
import com.dataguardlite.app.R
import com.dataguardlite.app.data.AppDatabase
import com.dataguardlite.app.data.SettingsRepository
import com.dataguardlite.app.repository.UsageRepository

class UsageCheckWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        val ctx = applicationContext
        val repo = UsageRepository(ctx, AppDatabase.get(ctx).snapshotDao())
        val settings = SettingsRepository(ctx)
        repo.snapshotNow()
        val limit = settings.limitMbFlow.first().coerceAtLeast(1L)
        val used = repo.totalMobileMbThisMonth()
        val pct = (used / limit) * 100f
        val threshold = when {
            pct >= 100f -> 100
            pct >= 90f -> 90
            pct >= 75f -> 75
            pct >= 50f -> 50
            else -> 0
        }
        if (threshold > 0 && settings.notificationsEnabledFlow.first()) {
            val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val notif = NotificationCompat.Builder(ctx, "alerts")
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Data usage alert")
                .setContentText("$threshold% of your monthly limit reached")
                .setAutoCancel(true)
                .build()
            nm.notify(threshold, notif)
        }
        return Result.success()
    }
}
