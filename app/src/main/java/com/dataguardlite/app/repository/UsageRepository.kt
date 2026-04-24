package com.dataguardlite.app.repository

import android.app.usage.NetworkStats
import android.app.usage.NetworkStatsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.os.Build
import android.telephony.TelephonyManager
import com.dataguardlite.app.data.SnapshotDao
import com.dataguardlite.app.data.UsageSnapshot
import java.util.Calendar

data class AppUsage(val packageName: String, val label: String, val mb: Float)
data class DailyUsage(val dayEpochMs: Long, val mb: Float)

class UsageRepository(
    private val ctx: Context,
    private val dao: SnapshotDao
) {
    private val nsm get() = ctx.getSystemService(Context.NETWORK_STATS_SERVICE) as NetworkStatsManager
    private val pm get() = ctx.packageManager
    private val usm get() = ctx.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private fun subscriberId(): String? {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) null
            else (ctx.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager).subscriberId
        } catch (_: SecurityException) { null }
    }

    private fun monthStart(): Long {
        val c = Calendar.getInstance()
        c.set(Calendar.DAY_OF_MONTH, 1)
        c.set(Calendar.HOUR_OF_DAY, 0); c.set(Calendar.MINUTE, 0); c.set(Calendar.SECOND, 0); c.set(Calendar.MILLISECOND, 0)
        return c.timeInMillis
    }

    suspend fun totalMobileMbThisMonth(): Float {
        return try {
            val bucket = nsm.querySummaryForDevice(
                ConnectivityManager.TYPE_MOBILE, subscriberId(), monthStart(), System.currentTimeMillis()
            )
            ((bucket.rxBytes + bucket.txBytes) / 1024f / 1024f)
        } catch (e: Exception) { 0f }
    }

    suspend fun topAppsThisMonth(limit: Int): List<AppUsage> {
        return try {
            val stats = nsm.querySummary(
                ConnectivityManager.TYPE_MOBILE, subscriberId(), monthStart(), System.currentTimeMillis()
            )
            val map = HashMap<Int, Long>()
            val b = NetworkStats.Bucket()
            while (stats.hasNextBucket()) {
                stats.getNextBucket(b)
                map[b.uid] = (map[b.uid] ?: 0L) + b.rxBytes + b.txBytes
            }
            stats.close()
            map.entries.sortedByDescending { it.value }.take(limit).map { (uid, bytes) ->
                val pkgs = pm.getPackagesForUid(uid)
                val pkg = pkgs?.firstOrNull() ?: "uid:$uid"
                val label = try { pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString() } catch (_: Exception) { pkg }
                AppUsage(pkg, label, bytes / 1024f / 1024f)
            }
        } catch (e: Exception) { emptyList() }
    }

    suspend fun dailyMobileMbLast(days: Int): List<DailyUsage> {
        val out = mutableListOf<DailyUsage>()
        val now = System.currentTimeMillis()
        val dayMs = 24L * 60 * 60 * 1000
        for (i in (days - 1) downTo 0) {
            val end = now - i * dayMs
            val start = end - dayMs
            val mb = try {
                val bucket = nsm.querySummaryForDevice(ConnectivityManager.TYPE_MOBILE, subscriberId(), start, end)
                (bucket.rxBytes + bucket.txBytes) / 1024f / 1024f
            } catch (_: Exception) { 0f }
            out += DailyUsage(end, mb)
        }
        return out
    }

    suspend fun snapshotNow() {
        val mobile = try {
            val b = nsm.querySummaryForDevice(ConnectivityManager.TYPE_MOBILE, subscriberId(), monthStart(), System.currentTimeMillis())
            b.rxBytes + b.txBytes
        } catch (_: Exception) { 0L }
        val wifi = try {
            val b = nsm.querySummaryForDevice(ConnectivityManager.TYPE_WIFI, "", monthStart(), System.currentTimeMillis())
            b.rxBytes + b.txBytes
        } catch (_: Exception) { 0L }
        dao.insert(UsageSnapshot(timestamp = System.currentTimeMillis(), mobileBytes = mobile, wifiBytes = wifi))
    }
}
