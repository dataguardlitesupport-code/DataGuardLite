package com.dataguardlite.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dataguardlite.app.ads.BannerAdView
import com.dataguardlite.app.viewmodel.DashboardViewModel
import com.dataguardlite.app.viewmodel.VMFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(onHistory: () -> Unit, onSettings: () -> Unit) {
    val ctx = LocalContext.current
    val vm: DashboardViewModel = viewModel(factory = VMFactory(ctx.applicationContext))
    val state by vm.state.collectAsState()

    LaunchedEffect(Unit) { vm.refresh() }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("DataGuard Lite") }, actions = {
                IconButton(onClick = onHistory) { Icon(Icons.Filled.History, null) }
                IconButton(onClick = onSettings) { Icon(Icons.Filled.Settings, null) }
            })
        }
    ) { pad ->
        Column(Modifier.padding(pad).padding(16.dp).fillMaxSize()) {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Mobile data this month", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text("%.1f MB / %d MB".format(state.usedMb, state.limitMb),
                        style = MaterialTheme.typography.headlineSmall)
                    Spacer(Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { (state.usedMb / state.limitMb.coerceAtLeast(1).toFloat()).coerceIn(0f, 1f) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
            Spacer(Modifier.height(16.dp))
            Text("Top apps", style = MaterialTheme.typography.titleMedium)
            Spacer(Modifier.height(8.dp))
            LazyColumn(Modifier.weight(1f)) {
                items(state.topApps) { app ->
                    ListItem(
                        headlineContent = { Text(app.label) },
                        supportingContent = { Text("%.1f MB".format(app.mb)) }
                    )
                    HorizontalDivider()
                }
            }
            BannerAdView(modifier = Modifier.fillMaxWidth())
        }
    }
}
