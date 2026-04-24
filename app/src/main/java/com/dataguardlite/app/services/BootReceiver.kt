package com.dataguardlite.app.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.dataguardlite.app.utils.PermissionUtils
import com.dataguardlite.app.utils.UsageCheckWorker
import java.util.concurrent.TimeUnit

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        if (action == Intent.ACTION_BOOT_COMPLETED ||
            action == Intent.ACTION_LOCKED_BOOT_COMPLETED ||
            action == "android.intent.action.QUICKBOOT_POWERON") {

            val req = PeriodicWorkRequestBuilder<UsageCheckWorker>(1, TimeUnit.HOURS).build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "usage_check", ExistingPeriodicWorkPolicy.KEEP, req)

            if (PermissionUtils.hasUsageAccess(context)) {
                UsageMonitorService.start(context)
            }
        }
    }
}
