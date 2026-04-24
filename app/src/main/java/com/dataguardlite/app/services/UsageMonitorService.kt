package com.dataguardlite.app.services

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.dataguardlite.app.R

class UsageMonitorService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notif: Notification = NotificationCompat.Builder(this, "service")
            .setContentTitle("DataGuard Lite")
            .setContentText("Monitoring mobile data usage")
            .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
            .setOngoing(true)
            .build()
        startForeground(1001, notif)
        return START_STICKY
    }
}
