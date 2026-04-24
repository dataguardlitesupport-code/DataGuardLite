package com.dataguardlite.app.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.dataguardlite.app.ui.screens.DashboardScreen
import com.dataguardlite.app.ui.screens.OnboardingScreen
import com.dataguardlite.app.viewmodel.MainViewModel

@Composable
fun AppRoot(vm: MainViewModel = viewModel()) {
    val state by vm.state.collectAsState()
    if (!state.hasUsageAccess) {
        OnboardingScreen(
            onCheckAgain = { vm.refresh() },
            onGranted = { vm.onUsageAccessGranted() }
        )
    } else {
        DashboardScreen(state = state, vm = vm)
    }
}
