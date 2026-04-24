package com.dataguardlite.app.repository

import android.app.usage.NetworkStats
import android.app.usage.NetworkStatsManager
import android.content.Context
import android.content.pm.PackageManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import android.telephony.TelephonyManager
import com.dataguardlite.app.data.AppUsage
import com.dataguardlite.app.data.UsageSummary
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Calendar

/**
 * Reads mobile data usage via NetworkStatsManager.
 * Requires PACKAGE_USAGE_STATS permission to be granted.
 */
class UsageRepository(private val context: Context) {

    suspend fun loadCurrentCycle(cycleStartDay: Int): Result<UsageSummary> =
        withContext(Dispatchers.IO) {
            runCatching {
                val (start, end) = currentCyclePeriod(cycleStartDay)
                val nsm = context.getSystemService(Context.NETWORK_STATS_SERVICE)
                    as? NetworkStatsManager
                    ?: error("NetworkStatsManager unavailable")

                val subscriberId = ""  // empty string is accepted on modern Android
                val total = runCatching {
                    nsm.querySummaryForDevice(
                        ConnectivityManager.TYPE_MOBILE,
                        subscriberId,
                        start,
                        end
                    )
                }.getOrNull()?.let { it.rxBytes + it.txBytes } ?: 0L

                val perApp = queryPerApp(nsm, subscriberId, start, end)
                UsageSummary(
                    totalMobileBytes = total,
                    perApp = perApp,
                    periodStart = start,
                    periodEnd = end
                )
            }
        }

    private fun queryPerApp(
        nsm: NetworkStatsManager,
        subscriberId: String,
        start: Long,
        end: Long
    ): List<AppUsage> {
        val pm = context.packageManager
        val results = HashMap<Int, Long>()
        var stats: NetworkStats? = null
        try {
            stats = nsm.querySummary(
                ConnectivityManager.TYPE_MOBILE,
                subscriberId,
                start,
                end
            )
            val bucket = NetworkStats.Bucket()
            while (stats?.hasNextBucket() == true) {
                stats.getNextBucket(bucket)
                val uid = bucket.uid
                results.merge(uid, bucket.rxBytes + bucket.txBytes) { a, b -> a + b }
            }
        } catch (_: Throwable) {
            return emptyList()
        } finally {
            stats?.close()
        }

        return results.entries
            .filter { it.value > 0 }
            .mapNotNull { (uid, bytes) ->
                val pkgs = pm.getPackagesForUid(uid)
                val pkg = pkgs?.firstOrNull() ?: return@mapNotNull AppUsage(
                    packageName = "uid:$uid",
                    label = labelForSpecialUid(uid),
                    mobileBytes = bytes
                )
                val label = runCatching {
                    pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString()
                }.getOrDefault(pkg)
                AppUsage(packageName = pkg, label = label, mobileBytes = bytes)
            }
            .sortedByDescending { it.mobileBytes }
    }

    private fun labelForSpecialUid(uid: Int): String = when (uid) {
        -4 -> "Tethering"
        -5 -> "Removed apps"
        0 -> "System"
        1000 -> "System (android)"
        else -> "UID $uid"
    }

    fun isMobileDataActive(): Boolean {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE)
            as? ConnectivityManager ?: return false
        val net = cm.activeNetwork ?: return false
        val caps = cm.getNetworkCapabilities(net) ?: return false
        return caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
    }

    private fun currentCyclePeriod(cycleStartDay: Int): Pair<Long, Long> {
        val now = Calendar.getInstance()
        val start = Calendar.getInstance().apply {
            set(Calendar.DAY_OF_MONTH, cycleStartDay.coerceIn(1, 28))
            set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
            if (timeInMillis > now.timeInMillis) add(Calendar.MONTH, -1)
        }
        return start.timeInMillis to now.timeInMillis
    }
}
