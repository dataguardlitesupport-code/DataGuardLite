package com.dataguardlite.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val LightScheme = lightColorScheme(
    primary = Color(0xFF0D6EFD),
    onPrimary = Color.White,
    secondary = Color(0xFF6C757D),
    background = Color(0xFFF8F9FA),
    surface = Color.White,
)

private val DarkScheme = darkColorScheme(
    primary = Color(0xFF4DA3FF),
    onPrimary = Color.Black,
    secondary = Color(0xFFADB5BD),
    background = Color(0xFF101418),
    surface = Color(0xFF1A1F24),
)

@Composable
fun DataGuardTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val ctx = LocalContext.current
    val scheme = when {
        Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
            if (darkTheme) dynamicDarkColorScheme(ctx) else dynamicLightColorScheme(ctx)
        darkTheme -> DarkScheme
        else -> LightScheme
    }
    MaterialTheme(colorScheme = scheme, content = content)
}
