package com.dataguardlite.app.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "snapshots")
data class UsageSnapshot(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long, val mobileBytes: Long, val wifiBytes: Long
)
