package com.dataguardlite.app.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.dataguardlite.app.util.Permissions
import com.dataguardlite.app.worker.UsageCheckWorker

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_LOCKED_BOOT_COMPLETED -> {
                if (Permissions.hasUsageAccess(context)) {
                    UsageMonitorService.start(context)
                }
                UsageCheckWorker.schedule(context)
            }
        }
    }
}
