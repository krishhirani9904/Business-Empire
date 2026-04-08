// src/hooks/useGameAds.js

import { useState, useEffect, useCallback } from 'react';

const useGameAds = () => {
    const [sdkReady, setSdkReady] = useState(false);
    const [adPlaying, setAdPlaying] = useState(false);

    useEffect(() => {
        // SDK ready check karo
        const checkSDK = setInterval(() => {
            if (typeof window.gdsdk !== 'undefined') {
                setSdkReady(true);
                clearInterval(checkSDK);
                console.log("✅ GameDistribution SDK ready!");
            }
        }, 100);

        return () => clearInterval(checkSDK);
    }, []);

    // Video Ad (Interstitial)
    const showVideoAd = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!sdkReady) {
                reject("SDK ready nathi");
                return;
            }

            setAdPlaying(true);

            if (typeof window.gdsdk !== 'undefined' && window.gdsdk.showAd) {
                window.gdsdk.showAd()
                    .then(() => {
                        console.log("✅ Video ad complete");
                        setAdPlaying(false);
                        resolve(true);
                    })
                    .catch((error) => {
                        console.log("⚠️ Ad skip/error:", error.message);
                        setAdPlaying(false);
                        resolve(false); // reject nahi, resolve false
                    });
            } else {
                setAdPlaying(false);
                reject("showAd function nathi");
            }
        });
    }, [sdkReady]);

    // Rewarded Video Ad
    const showRewardedAd = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!sdkReady) {
                reject("SDK ready nathi");
                return;
            }

            setAdPlaying(true);

            if (typeof window.gdsdk !== 'undefined' && window.gdsdk.showAd) {
                window.gdsdk.showAd('rewarded')
                    .then(() => {
                        console.log("✅ Rewarded ad complete");
                        setAdPlaying(false);
                        resolve(true);
                    })
                    .catch((error) => {
                        console.log("⚠️ Rewarded ad skip:", error.message);
                        setAdPlaying(false);
                        resolve(false);
                    });
            } else {
                setAdPlaying(false);
                reject("showAd function nathi");
            }
        });
    }, [sdkReady]);

    // Banner Display (GD SDK ma direct banner support nathi)
    // Aa function just placeholder che
    const showBanner = useCallback(() => {
        console.log("ℹ️ GD SDK doesn't support banner ads directly");
        // Banner ads production ma automatically display thase
    }, []);

    return {
        sdkReady,
        adPlaying,
        showVideoAd,
        showRewardedAd,
        showBanner
    };
};

export default useGameAds;