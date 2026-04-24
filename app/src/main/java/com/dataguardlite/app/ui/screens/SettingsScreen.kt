package com.dataguardlite.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dataguardlite.app.viewmodel.SettingsViewModel
import com.dataguardlite.app.viewmodel.VMFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onBack: () -> Unit) {
    val ctx = LocalContext.current
    val vm: SettingsViewModel = viewModel(factory = VMFactory(ctx.applicationContext))
    val state by vm.state.collectAsState()
    var limitText by remember(state.limitMb) { mutableStateOf(state.limitMb.toString()) }

    Scaffold(topBar = {
        TopAppBar(title = { Text("Settings") }, navigationIcon = {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null) }
        })
    }) { pad ->
        Column(Modifier.padding(pad).padding(16.dp).fillMaxSize()) {
            OutlinedTextField(value = limitText,
                onValueChange = { limitText = it.filter { c -> c.isDigit() } },
                label = { Text("Monthly Data Limit (MB)") }, modifier = Modifier.fillMaxWidth())
            Spacer(Modifier.height(12.dp))
            Button(onClick = { vm.setLimit(limitText.toLongOrNull() ?: 0L) }) { Text("Save") }
            Spacer(Modifier.height(24.dp))
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                Text("Notifications", modifier = Modifier.weight(1f))
                Switch(checked = state.notificationsEnabled, onCheckedChange = { vm.setNotifications(it) })
            }
            Spacer(Modifier.height(24.dp))
            Text("Permissions", style = MaterialTheme.typography.titleMedium)
            Text("Usage access: " + if (state.hasUsageAccess) "granted" else "missing")
        }
    }
}
