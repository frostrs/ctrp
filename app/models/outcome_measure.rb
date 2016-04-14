# == Schema Information
#
# Table name: outcome_measures
#
#  id                      :integer          not null, primary key
#  title                   :text
#  time_frame              :string(255)
#  description             :text
#  safety_issue            :string(255)
#  outcome_measure_type_id :integer
#  trial_id                :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  uuid                    :string(255)
#  lock_version            :integer          default(0)
#  index                   :integer
#

class OutcomeMeasure < ActiveRecord::Base
  include BasicConcerns

  belongs_to :outcome_measure_type
  belongs_to :trial

  after_create :save_index
  private
  def save_index
    max=OutcomeMeasure.maximum('index')
    if max.nil?
      p "max"
      new_index=0
    else
      new_index=max.next
    end
    self.index=new_index
    self.save!
  end
end
