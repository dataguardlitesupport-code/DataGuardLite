package com.dataguardlite.app.viewmodel

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import com.dataguardlite.app.data.SettingsRepository
import com.dataguardlite.app.utils.PermissionUtils

data class SettingsState(
    val limitMb: Long = 1000L,
    val notificationsEnabled: Boolean = true,
    val hasUsageAccess: Boolean = false
)

class SettingsViewModel(
    private val ctx: Context,
    private val settings: SettingsRepository
) : ViewModel() {
    private val _state = MutableStateFlow(SettingsState())
    val state: StateFlow<SettingsState> = _state

    init {
        viewModelScope.launch {
            _state.value = SettingsState(
                limitMb = settings.limitMbFlow.first(),
                notificationsEnabled = settings.notificationsEnabledFlow.first(),
                hasUsageAccess = PermissionUtils.hasUsageAccess(ctx)
            )
        }
    }

    fun setLimit(mb: Long) {
        viewModelScope.launch {
            settings.setLimit(mb)
            _state.value = _state.value.copy(limitMb = mb)
        }
    }
    fun setNotifications(enabled: Boolean) {
        viewModelScope.launch {
            settings.setNotificationsEnabled(enabled)
            _state.value = _state.value.copy(notificationsEnabled = enabled)
        }
    }
}
