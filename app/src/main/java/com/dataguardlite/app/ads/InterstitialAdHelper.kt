package com.dataguardlite.app.ads

import android.app.Activity
import android.content.Context
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback

private const val TEST_INTERSTITIAL = "ca-app-pub-3940256099942544/1033173712"

object InterstitialAdHelper {
    private var ad: InterstitialAd? = null
    fun preload(ctx: Context) {
        InterstitialAd.load(ctx, TEST_INTERSTITIAL, AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(p0: InterstitialAd) { ad = p0 }
                override fun onAdFailedToLoad(p0: LoadAdError) { ad = null }
            })
    }
    fun show(activity: Activity) { ad?.show(activity); ad = null }
}
