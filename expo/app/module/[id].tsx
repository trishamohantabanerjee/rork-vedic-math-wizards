import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useUser } from '@/hooks/user-store';
import { vedicMathModules, getQuestionsForModule } from '@/constants/modules';
import { ModuleProgress } from '@/types/module';
import WizardMascot from '@/components/WizardMascot';
import GradientButton from '@/components/GradientButton';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Play, BookOpen, Pause, PlayCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

type ModulePhase = 'learn' | 'practice' | 'understand' | 'completed';

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, updateUserPoints, completeModule, updateModuleProgress, getModuleProgress } = useUser();
  const insets = useSafeAreaInsets();
  const [currentPhase, setCurrentPhase] = useState<ModulePhase>('learn');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);
  const [practiceCount, setPracticeCount] = useState<number | null>(null);
  const [returnToPractice, setReturnToPractice] = useState<boolean>(false);
  const enableTimer = (process.env.EXPO_PUBLIC_ENABLE_TIMER ?? 'true') === 'true';
  const parsedLimit = Number(process.env.EXPO_PUBLIC_QUESTION_TIME_LIMIT ?? '30');
  const timeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 30;
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionCapSeconds = 600;
  const [sessionElapsed, setSessionElapsed] = useState<number>(0);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const module = vedicMathModules.find((m) => m.id === id);
  const allQuestions = getQuestionsForModule(id);
  const effectiveCount = practiceCount ?? allQuestions.length;
  const questions = allQuestions.slice(0, effectiveCount);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = getModuleProgress(id);
  const isReady = !!user && !!module;

  useEffect(() => {
    if (progress) {
      setCurrentPhase(progress.phase);
      setQuestionsAnswered(progress.questionsAnswered);
      setCorrectAnswers(progress.correctAnswers);
      setTotalTimeSpent(progress.timeSpent ?? 0);
    }
  }, [progress]);

  if (!isReady) {
    router.back();
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  const getNextPhase = (phase: ModulePhase): ModulePhase => {
    switch (phase) {
      case 'learn': return 'practice';
      case 'practice': return 'understand';
      case 'understand': return 'completed';
      default: return 'completed';
    }
  };

  const handlePhaseComplete = async (phase: ModulePhase) => {
    const newProgress: ModuleProgress = {
      moduleId: id,
      phase: phase === 'understand' ? 'completed' : getNextPhase(phase),
      questionsAnswered,
      correctAnswers,
      timeSpent: totalTimeSpent,
    };
    await updateModuleProgress(newProgress);
    if (!module) return;
    if (phase === 'understand') {
      await completeModule(id);
      await updateUserPoints(module.pointsReward);
      Alert.alert(
        '🎉 Congratulations!',
        `You've completed the ${module.title} module and earned ${module.pointsReward} points!`,
        [{ text: 'Awesome!', onPress: () => router.back() }]
      );
    } else {
      setCurrentPhase(getNextPhase(phase));
      if (phase === 'learn') {
        setPracticeCount(null);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setCorrectAnswers(0);
        setQuestionsAnswered(0);
        setTimeLeft(timeLimit);
        setIsPaused(false);
        setSessionElapsed(0);
      }
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const handleAnswerSubmit = useCallback(async (autoTimeout = false) => {
    if ((!selectedAnswer && !autoTimeout) || !currentQuestion) return;
    const isCorrect = !autoTimeout && selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);
    if (Platform.OS !== 'web') {
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    }
    const newQuestionsAnswered = questionsAnswered + 1;
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    setQuestionsAnswered(newQuestionsAnswered);
    setCorrectAnswers(newCorrectAnswers);
    if (isCorrect) {
      await updateUserPoints(currentQuestion.points);
    }
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(timeLimit);
        setIsPaused(false);
      } else {
        handlePhaseComplete('practice');
      }
    }, 1200);
  }, [selectedAnswer, currentQuestion, questionsAnswered, correctAnswers, updateUserPoints, currentQuestionIndex, questions.length, timeLimit]);

  useEffect(() => {
    if (!enableTimer) return;
    const running = currentPhase === 'practice' && practiceCount !== null && !showResult && !isPaused;
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current as unknown as number);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as unknown as number);
            setTotalTimeSpent((t) => t + 1);
            setShowResult(true);
            setTimeout(() => {
              handleAnswerSubmit(true);
            }, 400);
            return 0;
          }
          setTotalTimeSpent((t) => t + 1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current as unknown as number);
    };
  }, [enableTimer, currentPhase, practiceCount, showResult, isPaused, currentQuestionIndex, handleAnswerSubmit]);

  useEffect(() => {
    const practiceActive = currentPhase === 'practice' && practiceCount !== null;
    const ticking = practiceActive && !isPaused;
    if (ticking) {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current as unknown as number);
      sessionTimerRef.current = setInterval(() => {
        setSessionElapsed((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current as unknown as number);
    };
  }, [currentPhase, practiceCount, isPaused]);

  const parseCounts = (): number[] => {
    const raw = process.env.EXPO_PUBLIC_DEFAULT_QUESTION_COUNTS ?? '10,20,30,40';
    const parts = raw.split(',').map((x: string) => Number(x.trim())).filter((n: number) => Number.isFinite(n) && n > 0);
    return parts.length ? parts : [10, 20, 30, 40];
  };

  const renderLearnExamples = () => {
    if (!module) return null;
    if (module.operation === 'subtraction') {
      return (
        <>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>The "All from 9, Last from 10" Method</Text>
            <Text style={styles.conceptDescription}>
              Subtract instantly from bases like 100, 1000, 10000 by taking 9&apos;s complement of all digits and 10&apos;s complement of the last digit.
            </Text>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>2-digit example: 100 - 34</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>9 - 3 = 6</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>10 - 4 = 6</Text>
              </View>
            </View>
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Answer: 66 🎉</Text>
            </View>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>3-digit example: 1000 - 567</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>9 - 5 = 4</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>9 - 6 = 3</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>10 - 7 = 3</Text>
              </View>
            </View>
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Answer: 433 🎉</Text>
            </View>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>4-digit example: 10000 - 2896</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>9 - 2 = 7</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>9 - 8 = 1</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>9 - 9 = 0</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>10 - 6 = 4</Text>
              </View>
            </View>
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Answer: 7104 🎉</Text>
            </View>
          </View>
        </>
      );
    }
    if (module.operation === 'addition') {
      return (
        <>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Vertical Addition & Carry</Text>
            <Text style={styles.conceptDescription}>
              Add column by column from right to left. When a column exceeds 9, carry 1 to the next column. Same logic extends from 2-digit to any digits.
            </Text>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>2-digit example: 56 + 78</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Units: 6 + 8 = 14 → write 4, carry 1</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Tens: 5 + 7 + 1(carry) = 13 → write 13</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 134 🎉</Text></View>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>3-digit example: 384 + 579</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Units: 4 + 9 = 13 → write 3, carry 1</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Tens: 8 + 7 + 1 = 16 → write 6, carry 1</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>3</Text><Text style={styles.stepText}>Hundreds: 3 + 5 + 1 = 9</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 963 🎉</Text></View>
          </View>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptDescription}>Same logic applies to 4+ digits: keep carrying forward as needed.</Text>
          </View>
        </>
      );
    }
    if (module.operation === 'multiplication') {
      return (
        <>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Urdhva-Tiryagbhyam (Vertical & Crosswise)</Text>
            <Text style={styles.conceptDescription}>
              Multiply digits vertically and crosswise, summing partials with carries. Works identically from 2-digit × 2-digit to larger sizes.
            </Text>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>2-digit × 2-digit: 23 × 47</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Units: 3×7 = 21 → write 1, carry 2</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Cross: 2×7 + 3×4 = 14 + 12 = 26; +2(carry)=28 → write 8, carry 2</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>3</Text><Text style={styles.stepText}>Tens: 2×4 = 8; +2(carry)=10</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 1081 🎉</Text></View>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>3-digit × 2-digit: 123 × 45</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Use the same vertical/crosswise bands across digits, summing and carrying each step.</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 5535 🎉</Text></View>
          </View>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptDescription}>Same logic from 3 digits onward — just more crosswise bands to add.</Text>
          </View>
        </>
      );
    }
    if (module.operation === 'division') {
      return (
        <>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Paravartya Yojayet (Casting out and Adjust)</Text>
            <Text style={styles.conceptDescription}>
              For simple exact divisions, proceed as standard long division. For non-trivial divisors, use the Vedic reciprocal-based adjustments.
            </Text>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>2-digit divisor: 936 ÷ 12</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>93 ÷ 12 ≈ 7 → write 7, remainder 93 - 84 = 9</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Bring down 6 → 96 ÷ 12 = 8</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 78 🎉</Text></View>
          </View>
          <View style={styles.exampleCard}>
            <Text style={styles.exampleTitle}>3-digit dividend: 1440 ÷ 16</Text>
            <View style={styles.stepContainer}>
              <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>144 ÷ 16 = 9 → write 9</Text></View>
              <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Bring down 0 → 0 ÷ 16 = 0</Text></View>
            </View>
            <View style={styles.answerContainer}><Text style={styles.answerText}>Answer: 90 🎉</Text></View>
          </View>
          <View style={styles.conceptCard}>
            <Text style={styles.conceptDescription}>Same logic from higher digits — continue bringing down and dividing stepwise.</Text>
          </View>
        </>
      );
    }
    return null;
  };

  const renderLearnPhase = () => (
    <ScrollView 
      style={styles.phaseContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
    >
      <View style={styles.learnContainer}>
        <WizardMascot size={100} animated />
        <Text style={styles.phaseTitle}>{module?.title ?? 'Learn the Trick'}</Text>
        {renderLearnExamples()}
        <GradientButton
          testID="cta-practice"
          title={returnToPractice ? 'Back to Practice' : "I Got It! Let's Practice"}
          onPress={() => {
            if (returnToPractice) {
              setCurrentPhase('practice');
              setReturnToPractice(false);
            } else {
              handlePhaseComplete('learn');
            }
          }}
          size="large"
          align="center"
          maxWidth={520}
          style={styles.phaseButton}
        />
      </View>
    </ScrollView>
  );

  const renderPracticePhase = () => {
    if (practiceCount === null) {
      const options = parseCounts();
      return (
        <ScrollView 
          style={styles.phaseContent} 
          contentContainerStyle={[styles.practiceScrollContent, { paddingBottom: 24 + insets.bottom }]} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.practiceHeader}>
            <Text style={styles.phaseTitle}>Choose Questions</Text>
            <Text style={styles.questionCounter}>How many do you want to practice?</Text>
          </View>
          <View style={styles.questionContainer}>
            <View style={styles.optionsContainer}>
              {options.map((cnt) => (
                <TouchableOpacity
                  key={cnt}
                  testID={`select-count-${cnt}`}
                  style={styles.optionButton}
                  onPress={() => {
                    setPracticeCount(cnt);
                    setSessionElapsed(0);
                  }}
                >
                  <Text style={styles.optionText}>{cnt} Questions</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView 
        style={styles.phaseContent} 
        contentContainerStyle={[styles.practiceScrollContent, { paddingBottom: 24 + insets.bottom }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.practiceHeader}>
          <Text style={styles.phaseTitle}>Practice Time! 💪</Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <ProgressBar 
            progress={(currentQuestionIndex + 1) / questions.length} 
            height={8}
            style={{ width: '100%' }}
          />
          {enableTimer && (
            <View style={styles.timerRow}>
              <Text style={styles.timerText} testID="label-time-left">Time: {timeLeft}s</Text>
              <TouchableOpacity
                testID="cta-toggle-timer"
                style={styles.timerToggle}
                onPress={() => setIsPaused((p) => !p)}
              >
                {isPaused ? <PlayCircle size={18} color={colors.primary} /> : <Pause size={18} color={colors.primary} />}
                <Text style={styles.timerToggleText}>{isPaused ? 'Resume' : 'Pause'}</Text>
              </TouchableOpacity>
            </View>
          )}
          {enableTimer && (
            <>
              <ProgressBar
                progress={timeLeft / timeLimit}
                height={6}
                style={{ width: '100%' }}
              />
              <View style={styles.statsRow}>
                <Text style={styles.statsText} testID="label-total-time">Elapsed: {totalTimeSpent}s</Text>
                <Text style={styles.statsText} testID="label-avg-time">Avg: {questionsAnswered > 0 ? Math.round(totalTimeSpent / questionsAnswered) : 0}s/q</Text>
                <Text style={styles.statsText} testID="label-accuracy">Accuracy: {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0}%</Text>
              </View>
            </>
          )}
          <TouchableOpacity
            testID="cta-view-example"
            onPress={() => {
              setCurrentPhase('learn');
              setReturnToPractice(true);
            }}
            style={styles.exampleCta}
          >
            <Text style={styles.exampleCtaText}>Need an example? Tap to view</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          <View style={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                testID={`option-${index}`}
                style={[
                  styles.optionButton,
                  selectedAnswer === option ? styles.selectedOption : undefined,
                  showResult && option === currentQuestion.correctAnswer ? styles.correctOption : undefined,
                  showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer ? styles.incorrectOption : undefined,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option ? styles.selectedOptionText : undefined,
                  showResult && option === currentQuestion.correctAnswer ? styles.correctOptionText : undefined,
                ]}>
                  {option}
                </Text>
                {showResult && option === currentQuestion.correctAnswer && (
                  <CheckCircle size={24} color="#10B981" />
                )}
                {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <XCircle size={24} color="#EF4444" />
                )}
              </TouchableOpacity>
            ))}
          </View>
          {showResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.explanationText}>{currentQuestion?.explanation}</Text>
            </View>
          )}
          {!showResult && selectedAnswer && (
            <GradientButton
              title="Submit Answer"
              onPress={() => handleAnswerSubmit(false)}
              size="large"
              align="center"
              maxWidth={520}
              style={styles.submitButton}
            />
          )}
        </View>
      </ScrollView>
    );
  };

  const renderUnderstandPhase = () => (
    <ScrollView 
      style={styles.phaseContent} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
    >
      <View style={styles.understandContainer}>
        <Lightbulb size={60} color={colors.accent} />
        <Text style={styles.phaseTitle}>Now You Understand! 🧠</Text>
        <View style={styles.conceptCard}>
          <Text style={styles.conceptTitle}>Why Does This Work?</Text>
          <Text style={styles.conceptDescription}>
            When we subtract from 1000, we&apos;re actually doing:
          </Text>
          <Text style={styles.formulaText}>1000 = 999 + 1</Text>
          <Text style={styles.conceptDescription}>
            So 1000 - 567 becomes (999 - 567) + 1
          </Text>
          <Text style={styles.conceptDescription}>
            Subtracting from 999 is easy because each digit becomes 9 minus that digit!
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Practice Results:</Text>
          <Text style={styles.summaryText}>
            ✅ Correct Answers: {correctAnswers}/{questions.length}
          </Text>
          <Text style={styles.summaryText}>
            📊 Accuracy: {Math.round((correctAnswers / questions.length) * 100)}%
          </Text>
          <Text style={styles.summaryText}>
            ⏱️ Time Spent: {totalTimeSpent}s (Avg {questions.length > 0 ? Math.round(totalTimeSpent / questions.length) : 0}s/q)
          </Text>
          <Text style={styles.summaryText}>
            ⭐ Points Earned: {correctAnswers * 20}
          </Text>
        </View>
        <GradientButton
          title="Complete Module"
          onPress={() => handlePhaseComplete('understand')}
          size="large"
          align="center"
          maxWidth={520}
          style={styles.phaseButton}
        />
      </View>
    </ScrollView>
  );

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 'learn': return renderLearnPhase();
      case 'practice': return renderPracticePhase();
      case 'understand': return renderUnderstandPhase();
      default: return renderLearnPhase();
    }
  };

  const getPhaseIcon = (phase: ModulePhase) => {
    switch (phase) {
      case 'learn': return <Play size={20} color="#FFFFFF" />;
      case 'practice': return <CheckCircle size={20} color="#FFFFFF" />;
      case 'understand': return <Lightbulb size={20} color="#FFFFFF" />;
      default: return <Play size={20} color="#FFFFFF" />;
    }
  };

  const sessionTimeLeft = useMemo(() => Math.max(sessionCapSeconds - sessionElapsed, 0), [sessionElapsed]);
  const sessionOverCap = useMemo(() => sessionElapsed > sessionCapSeconds, [sessionElapsed]);
  const formatMMSS = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }, []);

  return (
    <LinearGradient
      colors={colors.gradients.navy}
      style={[
        styles.container,
        Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
      ]}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.moduleTitle}>{module?.title ?? 'Module'}</Text>
            <View style={styles.headerRow}>
              <View style={styles.phaseIndicator}>
                {getPhaseIcon(currentPhase)}
                <Text style={styles.phaseText}>
                  {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
                </Text>
              </View>
              <View style={styles.headerActions}>
                {currentPhase === 'practice' && practiceCount !== null && (
                  <View style={styles.sessionTimerWrap} testID="header-session-timer">
                    <SessionRing
                      size={36}
                      strokeWidth={4}
                      progress={Math.min(sessionElapsed / sessionCapSeconds, 1)}
                      color={sessionOverCap ? '#EF4444' : colors.primary}
                      backgroundColor={'#E5E7EB'}
                    />
                    <Text
                      style={[
                        styles.sessionTimeText,
                        sessionOverCap ? styles.sessionTimeOver : undefined,
                      ]}
                      testID="label-session-time"
                    >
                      {sessionOverCap ? `+${formatMMSS(sessionElapsed - sessionCapSeconds)}` : formatMMSS(sessionTimeLeft)}
                    </Text>
                  </View>
                )}
                {currentPhase !== 'learn' && (
                  <TouchableOpacity
                    testID="cta-go-examples"
                    style={styles.headerCta}
                    onPress={() => {
                      setCurrentPhase('learn');
                      setReturnToPractice(true);
                    }}
                  >
                    <BookOpen size={16} color={colors.primary} />
                    <Text style={styles.headerCtaText}>Examples</Text>
                  </TouchableOpacity>
                )}
                {currentPhase === 'learn' && returnToPractice && (
                  <TouchableOpacity
                    testID="cta-back-to-practice"
                    style={[styles.headerCta, styles.headerCtaPrimary]}
                    onPress={() => {
                      setCurrentPhase('practice');
                      setReturnToPractice(false);
                    }}
                  >
                    <Play size={16} color={'#FFFFFF'} />
                    <Text style={[styles.headerCtaText, styles.headerCtaPrimaryText]}>Back to Practice</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
        {renderPhaseContent()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 6,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  headerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  headerCtaPrimary: {
    backgroundColor: colors.primary,
  },
  headerCtaPrimaryText: {
    color: '#FFFFFF',
  },
  phaseContent: {
    flex: 1,
  },
  learnContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 24,
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  conceptCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  conceptDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exampleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  stepText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  answerContainer: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  answerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  phaseButton: {
    width: '100%',
  },
  practiceHeader: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  questionCounter: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
  },
  questionContainer: {
    flex: 0,
    paddingHorizontal: 24,
    gap: 16,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34,197,94,0.18)',
  },
  incorrectOption: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: colors.primary,
  },
  correctOptionText: {
    color: colors.success,
  },
  resultContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  explanationText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  understandContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 24,
  },
  formulaText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    backgroundColor: 'rgba(34,197,94,0.12)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  exampleCta: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'center',
  },
  exampleCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  timerRow: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '700',
  },
  timerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0EAFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  timerToggleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  statsRow: {
    marginTop: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  statsText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '700',
  },
  sessionTimerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    flexShrink: 0,
  },
  sessionTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sessionTimeOver: {
    color: '#EF4444',
  },
  practiceScrollContent: {
    paddingBottom: 24,
  },
});

function SessionRing({ size, strokeWidth, progress, color, backgroundColor }: { size: number; strokeWidth: number; progress: number; color: string; backgroundColor: string; }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.min(Math.max(progress, 0), 1));
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}