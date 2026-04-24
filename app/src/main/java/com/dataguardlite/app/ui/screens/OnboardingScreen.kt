package com.dataguardlite.app.ui.screens

import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.os.Process
import android.provider.Settings
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.dataguardlite.app.utils.PermissionUtils

@Composable
fun OnboardingScreen(onDone: () -> Unit) {
    val ctx = LocalContext.current
    var hasUsage by remember { mutableStateOf(PermissionUtils.hasUsageAccess(ctx)) }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Welcome to DataGuard Lite", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(12.dp))
        Text(
            "Monitor mobile data per-app and system-wide. Everything stays on your device — nothing is sent anywhere.",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(Modifier.height(24.dp))
        ElevatedCard(modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp)) {
                Text("Required permissions", style = MaterialTheme.typography.titleMedium)
                Spacer(Modifier.height(8.dp))
                Text("• Usage Access — read app usage and data stats")
                Text("• Notifications — alert you near your limit")
                Text("• Foreground service — keep tracking reliable")
            }
        }
        Spacer(Modifier.height(24.dp))
        Button(onClick = {
            ctx.startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }) { Text("Open Usage Access settings") }
        Spacer(Modifier.height(8.dp))
        OutlinedButton(onClick = { hasUsage = PermissionUtils.hasUsageAccess(ctx) }) {
            Text(if (hasUsage) "Permission granted" else "Re-check permission")
        }
        Spacer(Modifier.height(16.dp))
        Button(enabled = hasUsage, onClick = onDone) { Text("Continue") }
    }
}
