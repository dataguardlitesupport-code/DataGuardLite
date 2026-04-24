package com.dataguardlite.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.dataguardlite.app.ui.AppRoot
import com.dataguardlite.app.ui.theme.DataGuardTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            DataGuardTheme {
                AppRoot()
            }
        }
    }
}
