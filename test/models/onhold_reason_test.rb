# == Schema Information
#
# Table name: onhold_reasons
#
#  id         :integer          not null, primary key
#  code       :string(255)
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  uuid       :string(255)
#

require 'test_helper'

class OnholdReasonTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
