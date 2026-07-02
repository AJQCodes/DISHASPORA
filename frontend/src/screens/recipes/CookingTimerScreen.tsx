import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const DEFAULT_STEPS = [
  { instruction: 'Blend tomatoes, peppers and onion into a smooth paste.', duration: 300 },
  { instruction: 'Fry the blended mixture in hot oil for 15 minutes until reduced.', duration: 900 },
  { instruction: 'Add tomato paste, stock and seasoning. Stir well.', duration: 120 },
  { instruction: 'Wash and add rice. Cover and cook on low heat.', duration: 1500 },
  { instruction: 'Stir occasionally and check if rice is cooked.', duration: 300 },
  { instruction: 'Serve hot with fried plantain and chicken.', duration: 0 },
];

export default function CookingTimerScreen({ navigation, route }: any) {
  const { recipe } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_STEPS[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            Alert.alert('⏰ Time\'s up!', 'Move to the next step when ready.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleNext = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (currentStep < DEFAULT_STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setTimeLeft(DEFAULT_STEPS[next].duration);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(DEFAULT_STEPS[currentStep].duration);
  };

  const progress = DEFAULT_STEPS[currentStep].duration > 0
    ? ((DEFAULT_STEPS[currentStep].duration - timeLeft) / DEFAULT_STEPS[currentStep].duration) * 100
    : 100;

  if (completed) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Meal Complete!</Text>
        <Text style={styles.completedSubtitle}>
          Your {recipe?.name || 'dish'} is ready to serve!
        </Text>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate('RecipeReviews', { recipe })}
        >
          <Text style={styles.doneBtnText}>Rate this Recipe ⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back to Recipe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cooking Timer</Text>
      </View>

      {/* Recipe Name */}
      <Text style={styles.recipeName}>{recipe?.name || 'Jollof Rice'}</Text>

      {/* Step Progress */}
      <Text style={styles.stepProgress}>
        Step {currentStep + 1} of {DEFAULT_STEPS.length}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      {/* Timer Circle */}
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>
          {DEFAULT_STEPS[currentStep].duration === 0 ? '🍽️' : formatTime(timeLeft)}
        </Text>
        <Text style={styles.timerLabel}>
          {DEFAULT_STEPS[currentStep].duration === 0 ? 'Ready!' : isRunning ? 'Running' : 'Paused'}
        </Text>
      </View>

      {/* Current Step Instruction */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionLabel}>Current Step</Text>
        <Text style={styles.instructionText}>
          {DEFAULT_STEPS[currentStep].instruction}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>↺ Reset</Text>
        </TouchableOpacity>

        {DEFAULT_STEPS[currentStep].duration > 0 && (
          <TouchableOpacity
            style={styles.playBtn}
            onPress={isRunning ? handlePause : handleStart}
          >
            <Text style={styles.playBtnText}>{isRunning ? '⏸ Pause' : '▶ Start'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* All Steps */}
      <Text style={styles.allStepsTitle}>All Steps</Text>
      {DEFAULT_STEPS.map((step, i) => (
        <View
          key={i}
          style={[styles.stepRow, i === currentStep && styles.stepRowActive]}
        >
          <View style={[styles.stepBadge, i === currentStep && styles.stepBadgeActive,
            i < currentStep && styles.stepBadgeDone]}>
            <Text style={styles.stepBadgeText}>{i < currentStep ? '✓' : i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepText, i === currentStep && styles.stepTextActive]}>
              {step.instruction}
            </Text>
            {step.duration > 0 && (
              <Text style={styles.stepDuration}>⏱ {formatTime(step.duration)}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  backText: { color: '#E85D04', fontSize: 22 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  recipeName: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  stepProgress: { fontSize: 14, color: '#888', marginBottom: 12 },
  progressBarBg: { backgroundColor: '#F5F5F5', borderRadius: 10, height: 8, marginBottom: 32 },
  progressBarFill: { backgroundColor: '#E85D04', borderRadius: 10, height: 8 },
  timerCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#FFF3EC', borderWidth: 4, borderColor: '#E85D04', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  timerText: { fontSize: 36, fontWeight: 'bold', color: '#E85D04' },
  timerLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  instructionBox: { backgroundColor: '#FFF3EC', borderRadius: 12, padding: 16, marginBottom: 24 },
  instructionLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  instructionText: { fontSize: 16, color: '#1A1A1A', lineHeight: 24 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 10 },
  resetBtn: { flex: 1, backgroundColor: '#F5F5F5', padding: 14, borderRadius: 10, alignItems: 'center' },
  resetBtnText: { color: '#444', fontWeight: '600' },
  playBtn: { flex: 1, backgroundColor: '#04e0e8', padding: 14, borderRadius: 10, alignItems: 'center' },
  playBtnText: { color: '#fff', fontWeight: 'bold' },
  nextBtn: { flex: 1, backgroundColor: '#FFF3EC', padding: 14, borderRadius: 10, alignItems: 'center' },
  nextBtnText: { color: '#E85D04', fontWeight: '600' },
  allStepsTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, padding: 12, borderRadius: 10 },
  stepRowActive: { backgroundColor: '#FFF3EC' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepBadgeActive: { backgroundColor: '#E85D04' },
  stepBadgeDone: { backgroundColor: '#4CAF50' },
  stepBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  stepText: { fontSize: 14, color: '#666', lineHeight: 20 },
  stepTextActive: { color: '#1A1A1A', fontWeight: '600' },
  stepDuration: { fontSize: 12, color: '#E85D04', marginTop: 4 },
  completedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  completedEmoji: { fontSize: 80, marginBottom: 16 },
  completedTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  completedSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 32 },
  doneBtn: { backgroundColor: '#E85D04', padding: 16, borderRadius: 10, alignItems: 'center', width: '100%', marginBottom: 12 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backBtn: { padding: 16, alignItems: 'center' },
  backBtnText: { color: '#E85D04', fontSize: 15 },
});