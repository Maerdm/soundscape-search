"""
This scipt is just needed to run the application with docker
Loads the dataset to mongoDB container
"""

from pymongo import MongoClient
import json
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    try:
        mongo_uri = os.environ.get('MongoClient', 'mongodb://mongodb:27017')
        logger.info(f"Connecting to MongoDB at {mongo_uri}")
        client = MongoClient(mongo_uri)
        db = client['soundscape_search']
        
        collections = db.list_collection_names()
        logger.info(f"Existing collections: {collections}")
        
        for collection_name in collections:
            if collection_name != 'dataset':
                logger.info(f"Dropping collection: {collection_name}")
                db.drop_collection(collection_name)
        
        collection = db['dataset']
        
        existing_count = collection.count_documents({})
        if existing_count > 0:
            logger.info(f"Found {existing_count} existing documents in dataset collection. Deleting them...")
            collection.delete_many({})
            logger.info("Existing data deleted successfully.")
        
        json_path = "/app/dataset/dataset.json"
        logger.info(f"Loading dataset from {json_path}")
        
        if os.path.exists(json_path):
            with open(json_path, 'r') as file:
                data = json.load(file)
            
            if isinstance(data, list):
                logger.info(f"Successfully loaded JSON with {len(data)} records")
                collection.insert_many(data)
                logger.info(f"Successfully inserted all {len(data)} records into MongoDB")
            else:
                logger.info("Successfully loaded single JSON document")
                collection.insert_one(data)
                logger.info("Successfully inserted 1 record into MongoDB")
                
        else:
            logger.error(f"JSON file not found at {json_path}")
            logger.info(f"Files in directory: {os.listdir('/app/dataset/')}")
        
        collections = db.list_collection_names()
        logger.info(f"Final collections: {collections}")
        logger.info(f"Document count in dataset: {collection.count_documents({})}")
        
    except Exception as e:
        logger.error(f"Error in data loader: {e}")

# from pymongo import MongoClient
# import pandas as pd
# import os
# import logging
# import ast

# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# if __name__ == "__main__":
#     try:
#         # Connect to MongoDB
#         mongo_uri = os.environ.get('MongoClient', 'mongodb://mongodb:27017')
#         logger.info(f"Connecting to MongoDB at {mongo_uri}")
#         client = MongoClient(mongo_uri)
        
#         # Create database
#         db = client['soundscape_search']
        
#         # List all collections
#         collections = db.list_collection_names()
#         logger.info(f"Existing collections: {collections}")
        
#         # Drop all collections except 'dataset'
#         for collection_name in collections:
#             if collection_name != 'dataset':
#                 logger.info(f"Dropping collection: {collection_name}")
#                 db.drop_collection(collection_name)
        
#         # Use the dataset collection
#         collection = db['dataset']
        
#         # Check if data already exists in dataset collection and delete it
#         existing_count = collection.count_documents({})
#         if existing_count > 0:
#             logger.info(f"Found {existing_count} existing documents in dataset collection. Deleting them...")
#             collection.delete_many({})
#             logger.info("Existing data deleted successfully.")
        
#         # Load the dataset
#         path = "/app/dataset/dataset_acousticFeatures.csv"
#         logger.info(f"Loading dataset from {path}")
        
#         # Check if file exists
#         if os.path.exists(path):
#             df = pd.read_csv(path, sep=';')
#             logger.info(f"Successfully loaded dataset with {len(df)} records")
            
#             # Insert data row by row
#             logger.info("Inserting data into MongoDB...")
#             df["temporal_audio_features"] = df["temporal_audio_features"].apply(ast.literal_eval)
#             records = df.to_dict(orient="records")  # Convert DataFrame to dictionary
#             collection.insert_many(records)
            
#             logger.info(f"Successfully inserted all {len(df)} records into MongoDB")
#         else:
#             logger.error(f"CSV file not found at {path}")
#             # List files in directory to debug
#             logger.info(f"Files in directory: {os.listdir('/app/dataset/')}")
            
#         # Verify final database state
#         collections = db.list_collection_names()
#         logger.info(f"Final collections: {collections}")
#         logger.info(f"Document count in dataset: {collection.count_documents({})}")
        
#     except Exception as e:
#         logger.error(f"Error in data loader: {e}")