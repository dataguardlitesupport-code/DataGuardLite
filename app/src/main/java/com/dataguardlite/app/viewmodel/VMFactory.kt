package com.dataguardlite.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.dataguardlite.app.data.AppDatabase
import com.dataguardlite.app.data.SettingsRepository
import com.dataguardlite.app.repository.UsageRepository

class VMFactory(private val appContext: Context) : ViewModelProvider.Factory {
    private val db by lazy { AppDatabase.get(appContext) }
    private val settings by lazy { SettingsRepository(appContext) }
    private val usageRepo by lazy { UsageRepository(appContext, db.snapshotDao()) }

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T = when (modelClass) {
        DashboardViewModel::class.java -> DashboardViewModel(usageRepo, settings) as T
        HistoryViewModel::class.java -> HistoryViewModel(usageRepo) as T
        SettingsViewModel::class.java -> SettingsViewModel(appContext, settings) as T
        else -> throw IllegalArgumentException("Unknown VM $modelClass")
    }
}
