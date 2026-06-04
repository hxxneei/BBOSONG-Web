interface MemberCacheData {
  email: string;
  nickname: string | null;
  birth: string | null;
}

const MEMBER_CACHE_TTL_MS = 5 * 60 * 1000;

let memberCache:
  | {
      expiresAt: number;
      data: MemberCacheData;
    }
  | null = null;

export const getCachedMember = () => {
  if (!memberCache || memberCache.expiresAt <= Date.now()) {
    return null;
  }

  return memberCache.data;
};

export const setCachedMember = (data: MemberCacheData) => {
  memberCache = {
    data,
    expiresAt: Date.now() + MEMBER_CACHE_TTL_MS,
  };
};

export const updateCachedMember = (data: Partial<MemberCacheData>) => {
  if (!memberCache || memberCache.expiresAt <= Date.now()) {
    return;
  }

  memberCache = {
    ...memberCache,
    data: {
      ...memberCache.data,
      ...data,
    },
  };
};

export const clearMemberCache = () => {
  memberCache = null;
};
