package com.dataguardlite.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.dataguardlite.app.data.SettingsStore
import com.dataguardlite.app.data.UsageSummary
import com.dataguardlite.app.repository.UsageRepository
import com.dataguardlite.app.service.UsageMonitorService
import com.dataguardlite.app.util.Permissions
import com.dataguardlite.app.worker.UsageCheckWorker
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class UiState(
    val loading: Boolean = false,
    val hasUsageAccess: Boolean = false,
    val summary: UsageSummary? = null,
    val limitMb: Long = 5_000L,
    val cycleStartDay: Int = 1,
    val alertsEnabled: Boolean = true,
    val error: String? = null
)

class MainViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = UsageRepository(app)
    private val settings = SettingsStore(app)

    private val _state = MutableStateFlow(UiState())
    val state: StateFlow<UiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            combine(
                settings.limitMb, settings.cycleStartDay, settings.alertsEnabled
            ) { lim, cyc, al -> Triple(lim, cyc, al) }.collect { (lim, cyc, al) ->
                _state.update {
                    it.copy(limitMb = lim, cycleStartDay = cyc, alertsEnabled = al)
                }
            }
        }
        refresh()
    }

    fun refresh() {
        val ctx = getApplication<Application>()
        val granted = Permissions.hasUsageAccess(ctx)
        _state.update { it.copy(hasUsageAccess = granted, loading = granted, error = null) }
        if (!granted) return
        viewModelScope.launch {
            val cycleDay = settings.cycleStartDay.first()
            repo.loadCurrentCycle(cycleDay).fold(
                onSuccess = { s -> _state.update { it.copy(loading = false, summary = s) } },
                onFailure = { e ->
                    _state.update { it.copy(loading = false, error = e.message ?: "Failed to load") }
                }
            )
        }
    }

    fun onUsageAccessGranted() {
        val ctx = getApplication<Application>()
        UsageMonitorService.start(ctx)
        UsageCheckWorker.schedule(ctx)
        refresh()
    }

    fun setLimit(mb: Long) = viewModelScope.launch {
        settings.setLimitMb(mb); settings.setLastAlertLevel(0)
    }
    fun setCycleDay(day: Int) = viewModelScope.launch { settings.setCycleStartDay(day) }
    fun setAlertsEnabled(v: Boolean) = viewModelScope.launch { settings.setAlertsEnabled(v) }
}
