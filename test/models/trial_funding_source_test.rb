# == Schema Information
#
# Table name: trial_funding_sources
#
#  id              :integer          not null, primary key
#  trial_id        :integer
#  organization_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  uuid            :string(255)
#  lock_version    :integer          default(0)
#

require 'test_helper'

class TrialFundingSourceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
