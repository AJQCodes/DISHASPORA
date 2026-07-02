import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const EXISTING_REVIEWS = [
  { id: '1', name: 'Abena K.', rating: 5, comment: 'Absolutely delicious! The flavours were spot on. My whole family loved it.', date: 'June 10, 2026' },
  { id: '2', name: 'Chidi O.', rating: 4, comment: 'Great recipe! I added extra pepper and it was perfect for my taste.', date: 'June 8, 2026' },
  { id: '3', name: 'Fatima M.', rating: 5, comment: 'Best Jollof I have made at home. The step by step instructions were very helpful.', date: 'June 5, 2026' },
  { id: '4', name: 'Kofi A.', rating: 3, comment: 'Good but I felt the cooking time was a bit off. Needed more time for my rice.', date: 'June 1, 2026' },
];

export default function RecipeReviewsScreen({ navigation, route }: any) {
  const { recipe } = route.params || {};
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState(EXISTING_REVIEWS);
  const [submitted, setSubmitted] = useState(false);

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const handleSubmit = () => {
    if (userRating === 0) {
      return;
    }
    const newReview = {
      id: String(reviews.length + 1),
      name: 'You',
      rating: userRating,
      comment: comment || 'No comment.',
      date: 'Today',
    };
    setReviews([newReview, ...reviews]);
    setSubmitted(true);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => interactive && setUserRating(star)}
            disabled={!interactive}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
      </View>

      {/* Recipe Name */}
      <Text style={styles.recipeName}>{recipe?.name || 'Jollof Rice'}</Text>

      {/* Average Rating */}
      <View style={styles.avgBox}>
        <Text style={styles.avgNumber}>{avgRating.toFixed(1)}</Text>
        {renderStars(Math.round(avgRating))}
        <Text style={styles.avgCount}>{reviews.length} reviews</Text>
      </View>

      {/* Write a Review */}
      {!submitted ? (
        <View style={styles.reviewForm}>
          <Text style={styles.formTitle}>Rate this Recipe</Text>
          {renderStars(userRating, true)}
          {userRating > 0 && (
            <>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts (optional)..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Review</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.thankYouBox}>
          <Text style={styles.thankYouEmoji}>🎉</Text>
          <Text style={styles.thankYouText}>Thanks for your review!</Text>
        </View>
      )}

      {/* Reviews List */}
      <Text style={styles.sectionTitle}>All Reviews</Text>
      {reviews.map(review => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{review.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            {renderStars(review.rating)}
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 8, gap: 16 },
  back: { color: '#E85D04', fontSize: 22 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  recipeName: { fontSize: 18, color: '#666', marginBottom: 20 },
  avgBox: { alignItems: 'center', backgroundColor: '#FFF3EC', borderRadius: 16, padding: 24, marginBottom: 24 },
  avgNumber: { fontSize: 48, fontWeight: 'bold', color: '#E85D04' },
  avgCount: { fontSize: 14, color: '#888', marginTop: 4 },
  starsRow: { flexDirection: 'row', marginVertical: 4 },
  star: { fontSize: 24, color: '#ddd', marginHorizontal: 2 },
  starFilled: { color: '#E85D04' },
  reviewForm: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, marginBottom: 24 },
  formTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  commentInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginTop: 12, marginBottom: 12 },
  submitBtn: { backgroundColor: '#E85D04', padding: 14, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  thankYouBox: { alignItems: 'center', padding: 16, marginBottom: 24 },
  thankYouEmoji: { fontSize: 36, marginBottom: 8 },
  thankYouText: { fontSize: 16, color: '#1A1A1A', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 16 },
  reviewCard: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E85D04', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reviewName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  reviewDate: { fontSize: 12, color: '#888' },
  reviewComment: { fontSize: 14, color: '#444', lineHeight: 20 },
});