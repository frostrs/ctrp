# == Schema Information
#
# Table name: ind_ides
#
#  id             :integer          not null, primary key
#  ind_ide_type   :string(255)
#  grantor        :string(255)
#  nih_nci        :string(255)
#  holder_type_id :integer
#  trial_id       :integer
#  created_at     :datetime
#  updated_at     :datetime
#  uuid           :string(255)
#  lock_version   :integer          default(0)
#  ind_ide_number :string(255)
#

class IndIde < TrialBase
  include BasicConcerns

  belongs_to :holder_type
  belongs_to :trial

  validates :ind_ide_type, presence: true
  validates :grantor, presence: true
  validates :holder_type, presence: true
  validates :ind_ide_number, presence: true
end
