package com.dataguardlite.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dataguardlite.app.ui.components.AppRow
import com.dataguardlite.app.ui.components.UsageCard
import com.dataguardlite.app.viewmodel.MainViewModel
import com.dataguardlite.app.viewmodel.UiState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(state: UiState, vm: MainViewModel) {
    var showSettings by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("DataGuard Lite", fontWeight = FontWeight.SemiBold) },
                actions = {
                    IconButton(onClick = { vm.refresh() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                    IconButton(onClick = { showSettings = true }) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(horizontal = 16.dp)
                .fillMaxSize()
        ) {
            val limitBytes = state.limitMb * 1024L * 1024L
            UsageCard(
                usedBytes = state.summary?.totalMobileBytes ?: 0L,
                limitBytes = limitBytes
            )
            Spacer(Modifier.height(16.dp))

            when {
                state.loading -> Box(Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
                state.error != null -> Text(
                    "Error: ${state.error}",
                    color = MaterialTheme.colorScheme.error
                )
                state.summary == null || state.summary.perApp.isEmpty() -> Text(
                    "No mobile data usage in the current cycle yet.",
                    style = MaterialTheme.typography.bodyMedium
                )
                else -> {
                    Text("Per-app usage", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    LazyColumn(modifier = Modifier.weight(1f)) {
                        items(state.summary.perApp) { app ->
                            AppRow(app, state.summary.totalMobileBytes)
                            Divider()
                        }
                    }
                }
            }
        }

        if (showSettings) {
            SettingsDialog(
                state = state,
                onDismiss = { showSettings = false },
                onLimitChange = vm::setLimit,
                onCycleChange = vm::setCycleDay,
                onAlertsChange = vm::setAlertsEnabled
            )
        }
    }
}

@Composable
private fun SettingsDialog(
    state: UiState,
    onDismiss: () -> Unit,
    onLimitChange: (Long) -> Unit,
    onCycleChange: (Int) -> Unit,
    onAlertsChange: (Boolean) -> Unit
) {
    var limitText by remember(state.limitMb) { mutableStateOf(state.limitMb.toString()) }
    var cycleText by remember(state.cycleStartDay) { mutableStateOf(state.cycleStartDay.toString()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Settings") },
        text = {
            Column {
                OutlinedTextField(
                    value = limitText,
                    onValueChange = { limitText = it.filter { c -> c.isDigit() }.take(7) },
                    label = { Text("Monthly limit (MB)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = cycleText,
                    onValueChange = { cycleText = it.filter { c -> c.isDigit() }.take(2) },
                    label = { Text("Billing cycle start day (1-28)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Switch(checked = state.alertsEnabled, onCheckedChange = onAlertsChange)
                    Spacer(Modifier.width(12.dp))
                    Text("Send alerts at 50/75/90/100%")
                }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                limitText.toLongOrNull()?.let(onLimitChange)
                cycleText.toIntOrNull()?.let(onCycleChange)
                onDismiss()
            }) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    )
}
