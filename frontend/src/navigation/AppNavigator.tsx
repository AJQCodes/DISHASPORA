import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import DietaryProfileScreen from '../screens/auth/DietaryProfileScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import HomeFeedScreen from '../screens/recipes/HomeFeedScreen';
import RecipeCategoryScreen from '../screens/recipes/RecipeCategoryScreen';
import RecipeDetailScreen from '../screens/recipes/RecipeDetailScreen';
import RecipeSearchScreen from '../screens/recipes/RecipeSearchScreen';
import CookingTimerScreen from '../screens/recipes/CookingTimerScreen';
import RecipeReviewsScreen from '../screens/recipes/RecipeReviewsScreen';
import BookmarksScreen from '../screens/recipes/BookmarksScreen';
import RecipeUploadScreen from '../screens/recipes/RecipeUploadScreen';
import MealPlannerOnboardingScreen from '../screens/planner/MealPlannerOnboardingScreen';
import CalorieDashboardScreen from '../screens/planner/CalorieDashboardScreen';
import WeeklyMealPlanScreen from '../screens/planner/WeeklyMealPlanScreen';
import MealSlotDetailScreen from '../screens/planner/MealSlotDetailScreen';
import ShoppingListScreen from '../screens/planner/ShoppingListScreen';
import BudgetCookingModeScreen from '../screens/planner/BudgetCookingModeScreen';
import BudgetRecipeResultsScreen from '../screens/planner/BudgetRecipeResultsScreen';
import NutritionSummaryScreen from '../screens/planner/NutritionSummaryScreen';
import MarketplaceHomeScreen from '../screens/marketplace/MarketplaceHomeScreen';
import FoodListingDetailScreen from '../screens/marketplace/FoodListingDetailScreen';
import IngredientListingDetailScreen from '../screens/marketplace/IngredientListingDetailScreen';
import CartScreen from '../screens/marketplace/CartScreen';
import CheckoutScreen from '../screens/marketplace/CheckoutScreen';
import OrderConfirmationScreen from '../screens/marketplace/OrderConfirmationScreen';
import VendorRegistrationScreen from '../screens/marketplace/VendorRegistrationScreen';
import VendorProfileScreen from '../screens/marketplace/VendorProfileScreen';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="DietaryProfile" component={DietaryProfileScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
        <Stack.Screen name="HomeFeed" component={HomeFeedScreen} />
        <Stack.Screen name="RecipeCategory" component={RecipeCategoryScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="RecipeSearch" component={RecipeSearchScreen} />
        <Stack.Screen name="CookingTimer" component={CookingTimerScreen} />
        <Stack.Screen name="RecipeReviews" component={RecipeReviewsScreen} />
        <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        <Stack.Screen name="RecipeUpload" component={RecipeUploadScreen} />
        <Stack.Screen name="MealPlannerOnboarding" component={MealPlannerOnboardingScreen} />
        <Stack.Screen name="CalorieDashboard" component={CalorieDashboardScreen} />
        <Stack.Screen name="WeeklyMealPlan" component={WeeklyMealPlanScreen} />
        <Stack.Screen name="MealSlotDetail" component={MealSlotDetailScreen} />
        <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
        <Stack.Screen name="BudgetCookingMode" component={BudgetCookingModeScreen} />
        <Stack.Screen name="BudgetRecipeResults" component={BudgetRecipeResultsScreen} />
        <Stack.Screen name="NutritionSummary" component={NutritionSummaryScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceHomeScreen} />
        <Stack.Screen name="FoodListingDetail" component={FoodListingDetailScreen} />
        <Stack.Screen name="IngredientListingDetail" component={IngredientListingDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
        <Stack.Screen name="VendorProfile" component={VendorProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}