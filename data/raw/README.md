# Raw Dataset Directory

Place the official Kaggle "Customer Support on Twitter" dataset file here:
- Filename: `twcs.csv`
- Path: `data/raw/twcs.csv`

Dataset Source: https://www.kaggle.com/datasets/thoughtvector/customer-support-on-twitter

### Required CSV Schema:
- `tweet_id`: Unique integer identifier for the tweet
- `author_id`: Anonymous identifier for the tweet author (e.g. `115821` for customer or `@AppleSupport` for brand)
- `inbound`: Boolean (`True` / `False`) indicating whether the tweet was sent TO a brand by a customer
- `created_at`: Tweet timestamp (RFC 2822 format, e.g. `Tue Oct 31 22:10:45 +0000 2017`)
- `text`: Raw text content of the tweet
- `response_tweet_id`: Tweet ID(s) that responded to this tweet (comma-separated if multiple)
- `in_response_to_tweet_id`: Tweet ID that this tweet was replying to

### Starter Seed Data:
A starter seed dataset with representative multi-turn conversations for `@AppleSupport`, `@AmazonHelp`, and `@Uber_Support` is provided in `data/raw/sample_twcs.csv` so the pipeline scripts can be tested and verified immediately without downloading the full 2.8M row file.
If `twcs.csv` is not present, `scripts/analyze_dataset.py` automatically detects and falls back to `sample_twcs.csv`.
