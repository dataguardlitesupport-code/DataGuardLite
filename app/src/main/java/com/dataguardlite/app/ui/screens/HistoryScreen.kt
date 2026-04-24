package com.dataguardlite.app.ui.screens

import android.view.ViewGroup
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.dataguardlite.app.viewmodel.HistoryViewModel
import com.dataguardlite.app.viewmodel.VMFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(onBack: () -> Unit) {
    val ctx = LocalContext.current
    val vm: HistoryViewModel = viewModel(factory = VMFactory(ctx.applicationContext))
    val days by vm.daily.collectAsState()
    LaunchedEffect(Unit) { vm.load() }

    Scaffold(topBar = {
        TopAppBar(title = { Text("Usage History") }, navigationIcon = {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null) }
        })
    }) { pad ->
        Column(Modifier.padding(pad).padding(16.dp).fillMaxSize()) {
            AndroidView(
                modifier = Modifier.fillMaxWidth().height(280.dp),
                factory = { context ->
                    BarChart(context).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        description.isEnabled = false
                    }
                },
                update = { chart ->
                    val entries = days.mapIndexed { i, d -> BarEntry(i.toFloat(), d.mb.toFloat()) }
                    val ds = BarDataSet(entries, "MB / day")
                    chart.data = BarData(ds)
                    chart.invalidate()
                }
            )
        }
    }
}
