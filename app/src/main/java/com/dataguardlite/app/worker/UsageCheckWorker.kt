package com.dataguardlite.app.worker

import android.content.Context
import androidx.work.*
import com.dataguardlite.app.service.UsageMonitorService
import com.dataguardlite.app.util.Permissions
import java.util.concurrent.TimeUnit

class UsageCheckWorker(context: Context, params: WorkerParameters) :
    CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        if (Permissions.hasUsageAccess(applicationContext)) {
            UsageMonitorService.start(applicationContext)
        }
        return Result.success()
    }

    companion object {
        private const val NAME = "usage_check_worker"
        fun schedule(context: Context) {
            val req = PeriodicWorkRequestBuilder<UsageCheckWorker>(1, TimeUnit.HOURS)
                .setBackoffCriteria(BackoffPolicy.LINEAR, 15, TimeUnit.MINUTES)
                .build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                NAME, ExistingPeriodicWorkPolicy.KEEP, req
            )
        }
    }
}
