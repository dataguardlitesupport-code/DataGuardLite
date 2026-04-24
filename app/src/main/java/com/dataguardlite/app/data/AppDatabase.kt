package com.dataguardlite.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [UsageSnapshot::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun snapshotDao(): SnapshotDao
    companion object {
        @Volatile private var I: AppDatabase? = null
        fun get(ctx: Context): AppDatabase = I ?: synchronized(this) {
            I ?: Room.databaseBuilder(ctx.applicationContext, AppDatabase::class.java, "dataguard.db")
                .fallbackToDestructiveMigration().build().also { I = it }
        }
    }
}
