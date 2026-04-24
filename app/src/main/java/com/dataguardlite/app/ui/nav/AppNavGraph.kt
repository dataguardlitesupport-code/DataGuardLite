package com.dataguardlite.app.ui.nav

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.dataguardlite.app.ui.screens.DashboardScreen
import com.dataguardlite.app.ui.screens.HistoryScreen
import com.dataguardlite.app.ui.screens.OnboardingScreen
import com.dataguardlite.app.ui.screens.SettingsScreen

object Routes {
    const val ONBOARDING = "onboarding"
    const val DASHBOARD = "dashboard"
    const val HISTORY = "history"
    const val SETTINGS = "settings"
}

@Composable
fun AppNavGraph() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = Routes.ONBOARDING) {
        composable(Routes.ONBOARDING) { OnboardingScreen(onDone = { nav.navigate(Routes.DASHBOARD) { popUpTo(Routes.ONBOARDING) { inclusive = true } } }) }
        composable(Routes.DASHBOARD) { DashboardScreen(
            onHistory = { nav.navigate(Routes.HISTORY) },
            onSettings = { nav.navigate(Routes.SETTINGS) }
        ) }
        composable(Routes.HISTORY) { HistoryScreen(onBack = { nav.popBackStack() }) }
        composable(Routes.SETTINGS) { SettingsScreen(onBack = { nav.popBackStack() }) }
    }
}
