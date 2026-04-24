package com.dataguardlite.app.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "dataguard_settings")

class SettingsStore(private val context: Context) {

    private val keyLimitMb = longPreferencesKey("limit_mb")
    private val keyCycleDay = intPreferencesKey("cycle_day")
    private val keyAlertsEnabled = booleanPreferencesKey("alerts_enabled")
    private val keyLastAlertLevel = intPreferencesKey("last_alert_level")

    val limitMb: Flow<Long> = context.dataStore.data.map { it[keyLimitMb] ?: 5_000L }
    val cycleStartDay: Flow<Int> = context.dataStore.data.map { it[keyCycleDay] ?: 1 }
    val alertsEnabled: Flow<Boolean> = context.dataStore.data.map { it[keyAlertsEnabled] ?: true }
    val lastAlertLevel: Flow<Int> = context.dataStore.data.map { it[keyLastAlertLevel] ?: 0 }

    suspend fun setLimitMb(value: Long) {
        context.dataStore.edit { it[keyLimitMb] = value.coerceAtLeast(0) }
    }
    suspend fun setCycleStartDay(value: Int) {
        context.dataStore.edit { it[keyCycleDay] = value.coerceIn(1, 28) }
    }
    suspend fun setAlertsEnabled(value: Boolean) {
        context.dataStore.edit { it[keyAlertsEnabled] = value }
    }
    suspend fun setLastAlertLevel(value: Int) {
        context.dataStore.edit { it[keyLastAlertLevel] = value }
    }
}
