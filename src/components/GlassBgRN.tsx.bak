import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

const GlassBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/uthm_aerial.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.glassContainer}>{children}</View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    glassContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GlassBackground;
