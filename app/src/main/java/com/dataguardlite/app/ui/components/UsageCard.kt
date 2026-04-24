package com.dataguardlite.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.dataguardlite.app.util.Formatters

@Composable
fun UsageCard(usedBytes: Long, limitBytes: Long) {
    val percent = Formatters.percent(usedBytes, limitBytes).coerceAtMost(100)
    val color = when {
        percent >= 100 -> MaterialTheme.colorScheme.error
        percent >= 90 -> MaterialTheme.colorScheme.error
        percent >= 75 -> MaterialTheme.colorScheme.tertiary
        else -> MaterialTheme.colorScheme.primary
    }
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text("This billing cycle", style = MaterialTheme.typography.labelMedium)
            Spacer(Modifier.height(8.dp))
            Text(
                Formatters.bytes(usedBytes),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                "of ${Formatters.bytes(limitBytes)} ($percent%)",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(Modifier.height(12.dp))
            LinearProgressIndicator(
                progress = { percent / 100f },
                modifier = Modifier.fillMaxWidth().height(10.dp),
                color = color
            )
        }
    }
}
