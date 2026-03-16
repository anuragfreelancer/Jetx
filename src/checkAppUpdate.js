 
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import VersionCheck from "react-native-version-check";

// ✅ Apni App Store URL yahan daalo
const IOS_APP_STORE_URL =
  "https://apps.apple.com/us/app/brayh-est/id6759314635";

// ✅ Apni App Store App ID yahan daalo (URL ke end mein "id" ke baad wala number)
const IOS_APP_ID = "6759314635";

const UpdateModal = () => {
  const [visible, setVisible] = useState(false);
  const [storeUrl, setStoreUrl] = useState(IOS_APP_STORE_URL);
  const [loading, setLoading] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  const [latestVersion, setLatestVersion] = useState("");

  // ─── Version Check ────────────────────────────────────────────────────────
  const checkAppVersion = useCallback(async () => {
    try {
      const current = await VersionCheck.getCurrentVersion();
      setCurrentVersion(current);

      const updateInfo = await VersionCheck.needUpdate({
        provider: "appStore",
        appID: IOS_APP_ID,
        country: "us", // Change to your App Store country (e.g. "in", "gb")
      });

      console.log("[UpdateModal] Current:", current);
      console.log("[UpdateModal] VersionCheck result:", updateInfo);

      if (updateInfo?.isNeeded) {
        setLatestVersion(updateInfo.latestVersion || "");
        // Use detected URL, fallback to hardcoded
        setStoreUrl(updateInfo.storeUrl || IOS_APP_STORE_URL);
        setVisible(true);
      }
    } catch (error) {
      console.warn("[UpdateModal] Version check failed:", error.message);
      // Silent fail — modal nahi dikhao agar check fail ho
    }
  }, []);

  useEffect(() => {
    // Slight delay taaki app properly load ho pehle
    const timer = setTimeout(() => {
      checkAppVersion();
    }, 1500);

    return () => clearTimeout(timer);
  }, [checkAppVersion]);
      const deepLink = IOS_APP_STORE_URL;
console.log("deepLink",deepLink)
  // ─── Open App Store ───────────────────────────────────────────────────────
  const openAppStore = async () => {
    setLoading(true);
    try {
      // iOS pe itms-apps:// deep link use karo — direct App Store app khulta hai
      const deepLink = IOS_APP_STORE_URL;
      // const deepLink = `itms-apps://itunes.apple.com/app/id${IOS_APP_ID}`;
      // const canOpenDeepLink = await Linking.canOpenURL(deepLink);

      if (canOpenDeepLink) {
        await Linking.openURL(deepLink);
      } else {
        // Fallback: browser mein App Store page kholo
        const canOpenWeb = await Linking.canOpenURL(storeUrl);
        if (canOpenWeb) {
          await Linking.openURL(storeUrl);
        }
      }
    } catch (error) {
      console.warn("[UpdateModal] Failed to open App Store:", error.message);
      // Last resort fallback
      try {
        await Linking.openURL(IOS_APP_STORE_URL);
      } catch (e) {
        console.warn("[UpdateModal] All open attempts failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        // iOS back gesture se band nahi hoga (force update)
        // Optional update ke liye: setVisible(false)
      }}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            {/* App Icon Placeholder */}
            <View style={styles.appIconWrapper}>
             
                <Text style={styles.appIconEmoji}>📱</Text>
            
            </View>

            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>New Update</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Update Available</Text>

            {/* Version Info */}
            {latestVersion ? (
              <Text style={styles.versionText}>
                Version {latestVersion} is now available
                {currentVersion ? ` (you have ${currentVersion})` : ""}
              </Text>
            ) : null}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Message */}
            <Text style={styles.message}>
              Please update to the latest version to enjoy new features, bug
              fixes, and performance improvements.
            </Text>

            {/* Update Button */}
            <TouchableOpacity
              style={[styles.updateButton, loading && styles.updateButtonDisabled]}
              onPress={openAppStore}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                   <Text style={styles.updateButtonText}>Update on App Store</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Footer note */}
            <Text style={styles.footerNote}>
              This update is required to continue using the app.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default UpdateModal;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    // Android fallback
    elevation: 10,
  },
  appIconWrapper: {
    marginBottom: 16,
  },
  appIconBg: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  appIconEmoji: {
    fontSize: 34,
  },
  badge: {
     borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#FDE68A",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  versionText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 2,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    minHeight: 52,
    gap: 8,
    // iOS button shadow
    
  },
  updateButtonDisabled: {
    backgroundColor: "#93C5FD",
    shadowOpacity: 0,
  },
  updateButtonIcon: {
    fontSize: 16,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  footerNote: {
    marginTop: 14,
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});