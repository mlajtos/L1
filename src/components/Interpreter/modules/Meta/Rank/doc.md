# Rank

Rank returns the rank of the provided tensor

```L1
rank-0: Rank 1 ; rank-0 = 0
rank-1: Rank [1 2 3] ; rank-1 = 1
rank-2: Rank [1 2, 3 4] ; rank-2 = 2
rank-3: Rank RankUp [1 2, 3 4] ; rank-3 = 3
```

Rank can be expressed as the size of the shape of a tensor:
```L1
Rank: a => Size Shape a
```