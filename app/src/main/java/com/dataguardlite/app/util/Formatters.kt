package com.dataguardlite.app.util

import java.util.Locale
import kotlin.math.ln
import kotlin.math.pow

object Formatters {
    fun bytes(bytes: Long): String {
        if (bytes <= 0) return "0 B"
        val units = arrayOf("B", "KB", "MB", "GB", "TB")
        val digit = (ln(bytes.toDouble()) / ln(1024.0)).toInt().coerceAtMost(units.size - 1)
        val value = bytes / 1024.0.pow(digit.toDouble())
        return String.format(Locale.US, "%.2f %s", value, units[digit])
    }

    fun percent(used: Long, limit: Long): Int {
        if (limit <= 0) return 0
        return ((used.toDouble() / limit) * 100).toInt().coerceIn(0, 999)
    }
}
