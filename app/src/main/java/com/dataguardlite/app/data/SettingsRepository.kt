package com.dataguardlite.app.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "settings")

class SettingsRepository(private val ctx: Context) {
    private val LIMIT = longPreferencesKey("limit_mb")
    private val NOTIF = booleanPreferencesKey("notif_enabled")

    val limitMbFlow = ctx.dataStore.data.map { it[LIMIT] ?: 1000L }
    val notificationsEnabledFlow = ctx.dataStore.data.map { it[NOTIF] ?: true }

    suspend fun setLimit(mb: Long) { ctx.dataStore.edit { it[LIMIT] = mb } }
    suspend fun setNotificationsEnabled(v: Boolean) { ctx.dataStore.edit { it[NOTIF] = v } }
}
