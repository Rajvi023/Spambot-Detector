import numpy as np
import pandas as pd


tweets = pd.read_csv("./tweets_per_year.csv")
users = pd.read_csv("./crowdflower_results_detailed.csv")


#tweets_truncated = tweets[['timestamp','user_id','tweets']]
#tweets_truncated['tweet']=1

#new = tweets_truncated["timestamp"].str.split("-", n = 1, expand = True)

#tweets_truncated['timestamp']=new[0]
#tweets_truncated["timestamp"]= tweets_truncated["timestamp"].str.split("t", n = 1, expand = True)
#print(tweets_truncated)

#tweets_sum = (tweets_truncated.drop('id', axis=1).groupby(['timestamp','user_id']).sum()).rename(columns=lambda x: 'Sum('+x+')')
#print(tweets_sum.tail())
#tweets_truncated=tweets_truncated.drop(['id'])
tweets_df = tweets.merge(users, on='user_id', how='left')
tweets_df = tweets_df.drop(["crowdflower_id", "channel", "trust", "contributor_id","ground_truth_class","comment","dataset","account_type"], axis=1)
print(tweets_df.head())
tweets_df = tweets_df.drop_duplicates(subset=['timestamp', 'user_id'], keep='first')
#tweets_df=tweets_df.drop(['id'])
print(tweets_df.head())

tweets_df.to_csv('tweets_per_year_labeled.csv')