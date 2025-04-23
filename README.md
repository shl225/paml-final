# Steam Price Predictor (Checkpoint Version)
Uses Ridge Regression and Gradient Boosting Decision Trees (GBDT) trained on ~65k games with ~67 features from Steam database

**Issue List:**

* Prices were extremely skewed (lots of cheap games and few pricey ones)
* Some trained features were leaking the price info causing models to be 99.9% accurate
* Needed more ways to accurately judge each model

**Fixes:**

* Used stratified K-Fold CV for better eval (makes sure each 'fold' has similar mix of prices)
* Feature engineering no longer cheats by inadvertently seeing test data, got rid of feature leaks like "Value For Money"
* Methods for price elasticity / discount ideas updated to be leak-free
* Added predictions for log of the price due to extreme skew

**Initial Results:**

* `GBDT (Log-Price)`: **MAE ~$4.81, Bucket Acc (±1) ~87.2%**
* `Ridge (Log-Price)`: MAE ~$5.04, Bucket Acc (±1) ~86.2%
* `GBDT (Price)`: MAE ~$6.15, Bucket Acc (±1) ~65.9%
* `Ridge (Price)`: MAE ~$5.51, Bucket Acc (±1) ~79.2%

*(MAE is Mean Absolute Error in $, Bucket Acc (±1) is % of predictions within one price bracket of the real one)*

**What drives price?**

Seems like review counts, owner estimates, achievements data, and certain tags/genres (like indie, simulation) matter more among the features.

**Pricing:**

I added some basic price elasticity estimates and discount % recommendations since those will be important for our final frontend. Running suggested maybe a ~5% price drop could be optimal on average for the test games. But this does need some sort of confidence/logic checks.

### Credits

* **Angelique Taylor** for help with Ridge Regression code structure (https://canvas.cornell.edu/courses/73516/files/12333700?module_item_id=3046217)
* **Stefan Lessmann** for help with GBDT code structure (https://github.com/Humboldt-WI/bads/blob/master/algorithms_from_scratch/gradient_boosting.ipynb)
* **Prajwal Kusha** Housing Price repo helped as well (https://github.com/PrajwalKusha/House_Price_Prediction_Kaggle_Competition)
