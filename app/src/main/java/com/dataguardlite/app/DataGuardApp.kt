package com.dataguardlite.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.google.android.gms.ads.MobileAds

class DataGuardApp : Application() {
    override fun onCreate() {
        super.onCreate()
        MobileAds.initialize(this) {}
        createChannels()
    }

    private fun createChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(
                NotificationChannel("alerts", getString(R.string.channel_alerts), NotificationManager.IMPORTANCE_HIGH)
            )
            nm.createNotificationChannel(
                NotificationChannel("service", getString(R.string.channel_service), NotificationManager.IMPORTANCE_LOW)
            )
        }
    }
}
