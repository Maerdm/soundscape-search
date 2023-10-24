from annoy import AnnoyIndex
from sklearn.neighbors import KDTree
import numpy as np

def k_d_tree(data, inputVector, numClosestNeighbours):
    '''takes as input the id, dimensions and length of Playlist, returns the song ids of the closest neighbours'''
    # knearest extrahiert die doppelte größe der eigentlichen playlist, um später doppelte artists entfernen zu können
    # data = [[songAdresse1, songAdresse2, ...], [[InputVector], [5DimVektor], [5DimVektor2], ...]]
    data[1].insert(0, inputVector)
    songList = []

    # ensure number of requested songs is as big as the actual song list
    if numClosestNeighbours > len(data[0]):
        numClosestNeighbours = len(data[0])

    tree = KDTree(data[1], leaf_size=3)
    dist, ind = tree.query(data[1][:1], k=numClosestNeighbours + 1)
    ind = np.array(ind).flatten().tolist()

    # erase query point (is always 0th element in data array) queryPoint = InputVector
    for i, val in enumerate(ind):
        if val == 0:
          del ind[i]
        # subtract array index and get the Songadress (subtract because inputVector is deleted)
        ind[i] = ind[i] - 1
        songList.append(data[0][ind[i]])

    return songList

def annoy(song_id_dimensions, inputVector, numClosestNeighbours):
    '''takes as input the id, dimensions and length of Playlist, returns the song ids of the closest neighbours'''

    ids = song_id_dimensions[0]
    dimensions = song_id_dimensions[1]

    dimensions.insert(0, inputVector)
    songList = []

    dimension_length = len(dimensions[0])  # Length of item vector that will be indexed
    annoy = AnnoyIndex(dimension_length, 'euclidean')
    for i, val in enumerate(dimensions):
        annoy.add_item(i, val)

    annoy.build(40) # 10 trees
    ind = annoy.get_nns_by_item(0, numClosestNeighbours)
    
    # erase query point (is always 0th element in data array) queryPoint = InputVector
    for i, val in enumerate(ind):
        if val == 0:
          del ind[i]
        # subtract array index and get the Songadress (subtract because inputVector is deleted)
        ind[i] = ind[i] - 1
        songList.append(ids[ind[i]])
    
    return songList