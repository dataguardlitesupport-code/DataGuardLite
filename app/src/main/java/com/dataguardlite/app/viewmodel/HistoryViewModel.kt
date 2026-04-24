package com.dataguardlite.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.dataguardlite.app.repository.DailyUsage
import com.dataguardlite.app.repository.UsageRepository

class HistoryViewModel(private val repo: UsageRepository) : ViewModel() {
    private val _daily = MutableStateFlow<List<DailyUsage>>(emptyList())
    val daily: StateFlow<List<DailyUsage>> = _daily
    fun load() {
        viewModelScope.launch { _daily.value = repo.dailyMobileMbLast(7) }
    }
}
