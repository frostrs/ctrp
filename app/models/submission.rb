# == Schema Information
#
# Table name: submissions
#
#  id                  :integer          not null, primary key
#  submission_num      :integer
#  submission_date     :date
#  amendment_date      :date
#  amendment_reason_id :integer
#  trial_id            :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  uuid                :string(255)
#  lock_version        :integer          default(0)
#  amendment_num       :string(255)
#
# Indexes
#
#  index_submissions_on_amendment_reason_id  (amendment_reason_id)
#  index_submissions_on_trial_id             (trial_id)
#

class Submission < ActiveRecord::Base
  include BasicConcerns

  belongs_to :amendment_reason
  belongs_to :trial
  has_many :milestone_wrappers, -> { order 'milestone_wrappers.id' }
end
