# Author: Gaurav Mittal

# Steps to use:
#   - Start the server (you will need to do pip install flask and flask_cors) and use python3
#   - For Get:
#       - Just send an ajax request to your http://your-ip:5000/hello
#       - The response will a json object so you will need to treat it as such
#   - For Post:
#       - Just send an ajax request to your http://your-ip:5000/bye
#       - Send a post request with the variables (in my example, I am using variable counter, but you can edit it for whatever you want)
#       - The response will be in json so treat it as such.
#
#   One way for testing post is through your terminal. Just run this curl command with the neccessary changes:
#   curl --header "Content-Type: application/json"   --request POST   --data '{"counter":"1"}'   http://your-ip:5000/bye

#

#   The /hello and /bye are just my examples. You can add more api routes following the structure.
#   My example uses a global counter variable which is incremented with the value sent by the post request and returned in json.
#   - One good way is to write python algorithm in a function in another file and include that function here
#     and just use this file as a rest api routes file

from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import numpy as np
import pandas as pd
import os

from sklearn.decomposition import KernelPCA as PCA
from sklearn.manifold import TSNE
from sklearn.manifold import LocallyLinearEmbedding as LLE
import pickle
from sklearn.preprocessing import MinMaxScaler, StandardScaler

app = Flask(__name__)
CORS(app)

### EXAMPLE
counter = 0


# GET EXAMPLE
@app.route('/hello')
def index():
    response = jsonify({'message': str(counter)})
    return response


# POST EXAMPLE
@app.route('/bye', methods=['POST'])
def bye():
    if not request.json or not 'counter' in request.json:
        abort(400)

    global counter

    incomingIncrement = int(request.json['counter'])
    counter = counter + incomingIncrement
    response = jsonify({'message': str(counter)})
    return response

def getUserList(word, user_ids_list, word_user):
    user_list = []
    for user in word_user[word]:
        if len(user_ids_list) == 0:
            user_list.append(user)
        if str(user) in user_ids_list:
            user_list.append(user)
    return user_list

@app.route('/tcv', methods=['POST'])
def tcv():
    data_directory = '../data/'
    print(request.json)
    user_ids = request.json['user_ids']
    count = int(request.json['count'])
    dataset = int(request.json['dataset'])
    word_user = pickle.load(open(data_directory + 'sample_' + str(dataset) + '/word_user_dict.pkl', 'rb'))
    aggregatedDF = pd.read_csv(data_directory + 'sample_' + str(dataset) + '/tcv_aggregated.csv')
    if len(user_ids) > 0:
        aggregatedDF = aggregatedDF[aggregatedDF['user_id'].isin(user_ids)]
    df = aggregatedDF.groupby(['word'], as_index=False).agg(
        {'polarity': 'mean', 'subjectivity': 'mean', 'count': 'sum'})
    df = df.sort_values(by=['count'], ascending=False).values
    jsonList = []
    for record in df:
        r = {
            'word': record[0],
            'polarity': record[1],
            'subjectivity': record[2],
            'count': record[3],
            'users': getUserList(record[0], user_ids, word_user)
        }
        jsonList.append(r)
        count = count - 1
        if count == 0:
            break
    response = jsonify(jsonList)
    return response

@app.route('/cluster', methods=['POST'])
def clustering():
    algo = request.json['algo']
    params = request.json['params']

    df = pd.read_csv('../data/genuine_accounts_sample.csv/user_tweet_features.csv')
    data_directory = "../data"
    df = pd.read_csv(os.path.join(data_directory,'genuine_accounts_sample.csv','user_tweet_features.csv'))
    reduceddf = pd.DataFrame()
    reduceddf['user_id'] = df["user_id"]
    reduceddf['tweet_count'] = df['Count(tweets)']

    if params['transformation']=='minmax':
    	scaler = MinMaxScaler(feature_range=(0, 1))
    	df[df.columns[1:]]=scaler.fit_transform(df[df.columns[1:]])
    elif params['transformation']=='standardize':
    	scaler = StandardScaler(with_mean=True, with_std=True)
    	df[df.columns[1:]]=scaler.fit_transform(df[df.columns[1:]])

    if algo=='tsne':
        tsne = TSNE(n_components=2, perplexity=params['perplexity'], early_exaggeration=params['early_exaggeration'],
                    learning_rate=params['lr'])
        tsne_result = tsne.fit_transform(df[list(df.columns)[1:]].values)
        reduceddf['x'] = tsne_result[:, 0]
        reduceddf['y'] = tsne_result[:, 1]
    elif algo == 'pca':
        pca = PCA(n_components=2, kernel=params['kernel'], gamma=params['gamma'], coef0=params['coef0'],
                  degree=params['degree'])
        pca_result = pca.fit_transform(df[list(df.columns)[1:]].values)
        reduceddf['x'] = pca_result[:, 0]
        reduceddf['y'] = pca_result[:, 1]
    elif algo == 'lle':
        lle = LLE(n_components=2, n_neighbors=params['n_neighbors'])
        lle_result = lle.fit_transform(df[list(df.columns)[1:]].values)
        reduceddf['x'] = lle_result[:, 0]
        reduceddf['y'] = lle_result[:, 1]

    response = reduceddf.to_json(orient='records')
    return response

@app.route('/timeline', methods=['POST'])
def timelineData():
    data_directory = '../data/'
    print(request.json)
    year = request.json['year']
    month = request.json['month']
    day = request.json['day']
    view = request.json['view']
    if view == 'year':
        view = ['user_id', 'year']
    elif view == 'month':
        view = ['user_id', 'year', 'month']
    elif view == 'day':
        view = ['user_id', 'year', 'month', 'day']
    data = pd.read_csv(data_directory + 'tweets_aggregated.csv')

    filtered_output = data
    if len(year) > 0:
        filtered_output = filtered_output[filtered_output['year'].isin(year)]
    if len(month) > 0:
        filtered_output = filtered_output[filtered_output['month'].isin(month)]
    if len(day) > 0:
        filtered_output = filtered_output[filtered_output['day'].isin(day)]
    filtered_output['tweets'] = 1
    filtered_output = filtered_output.groupby(view, as_index=False).sum()
    filtered_output = filtered_output[['year', 'month', 'day', 'user_id', 'retweet_count', 'reply_count', 'favorite_count', 'num_hashtags', 'tweets']]

    fields = ['year', 'month', 'day', 'user_id', 'retweet_count', 'reply_count', 'favorite_count', 'num_hashtags', 'tweets']
    json_out = []
    for record in filtered_output.values:
        jsonRecord = {}
        for field, value in zip(fields, record):
            jsonRecord[field] = str(value)
        json_out.append(jsonRecord)
        print(json_out)
    response = jsonify(json_out)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
