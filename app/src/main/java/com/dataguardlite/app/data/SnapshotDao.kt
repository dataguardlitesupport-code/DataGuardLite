package com.dataguardlite.app.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface SnapshotDao {
    @Insert suspend fun insert(s: UsageSnapshot)
    @Query("SELECT * FROM snapshots WHERE timestamp >= :since ORDER BY timestamp ASC")
    suspend fun since(since: Long): List<UsageSnapshot>
}
