package com.dataguardlite.app.data

data class AppUsage(
    val packageName: String,
    val label: String,
    val mobileBytes: Long
)

data class UsageSummary(
    val totalMobileBytes: Long,
    val perApp: List<AppUsage>,
    val periodStart: Long,
    val periodEnd: Long
)
