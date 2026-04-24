package com.dataguardlite.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import com.dataguardlite.app.data.SettingsRepository
import com.dataguardlite.app.repository.AppUsage
import com.dataguardlite.app.repository.UsageRepository

data class DashboardState(val usedMb: Float = 0f, val limitMb: Long = 1000L, val topApps: List<AppUsage> = emptyList())

class DashboardViewModel(private val repo: UsageRepository, private val settings: SettingsRepository) : ViewModel() {
    private val _state = MutableStateFlow(DashboardState())
    val state: StateFlow<DashboardState> = _state
    fun refresh() {
        viewModelScope.launch {
            _state.value = DashboardState(usedMb = repo.totalMobileMbThisMonth(),
                limitMb = settings.limitMbFlow.first(), topApps = repo.topAppsThisMonth(3))
        }
    }
}
