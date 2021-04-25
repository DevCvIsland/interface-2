import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo, StakingType } from '../../state/stake/hooks'
import { TYPE } from '../../theme'
import PoolCard from '../../components/mill/PoolCard'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/mill/styled'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'
import { JSBI } from '@baguette-exchange/sdk'

const PageWrapper = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const TopSection = styled(AutoColumn)`
   max-width: 720px;
   width: 100%;
 `

const PoolSection = styled.div`
   display: grid;
   grid-template-columns: 1fr;
   column-gap: 10px;
   row-gap: 15px;
   width: 100%;
   justify-self: center;
 `

export default function Oven() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo(StakingType.SINGLE)

  const DataRow = styled(RowBetween)`
     ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
   `};
   `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Welcome to the baking oven. Stake tokens to bake new fresh Baguettes</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your tokens to receive BAG.
                 </TYPE.white>
              </RowBetween>{' '}
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <TYPE.black fontWeight={400}>
            First Baguette batch ends on May 31st
          </TYPE.black>
        </DataRow>

        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.sort(
                function(info_a, info_b) {
                  // greater stake in avax comes first
                  return info_a.totalStakedInWavax?.greaterThan(info_b.totalStakedInWavax ?? JSBI.BigInt(0)) ? -1 : 1
                }
              ).sort(
                function(info_a, info_b) {
                  if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0))) {
                    if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
                      // both are being staked, so we keep the previous sorting
                      return 0
                    else
                      // the second is actually not at stake, so we should bring the first up
                      return -1
                  } else {
                    if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
                      // first is not being staked, but second is, so we should bring the first down
                      return 1
                    else
                      // none are being staked, let's keep the  previous sorting
                      return 0
                  }
              }).map(
                stakingInfo => {
                  return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
                }
              )
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
