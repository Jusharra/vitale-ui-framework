-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  organization text NOT NULL,
  category text NOT NULL,
  state text NOT NULL,
  county text,
  phone text,
  website text,
  eligibility text,
  documents_needed text[],
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_resources_state ON resources USING btree (state);
CREATE INDEX IF NOT EXISTS idx_resources_county ON resources USING btree (county);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources USING btree (category);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING gin (tags);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view resources"
  ON resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create trigger for updating the updated_at column
CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON resources
FOR EACH ROW
EXECUTE FUNCTION update_resources_updated_at();

-- Insert sample data
INSERT INTO resources (title, description, organization, category, state, county, phone, website, eligibility, documents_needed, tags)
VALUES
  (
    'California Medicaid (Medi-Cal)',
    'Medi-Cal offers free or low-cost health coverage for children and adults with limited income and resources.',
    'California Department of Health Care Services',
    'healthcare',
    'California',
    NULL,
    '1-800-541-5555',
    'https://www.dhcs.ca.gov/services/medi-cal',
    'Income-based eligibility, varies by family size and county of residence.',
    ARRAY['Proof of identity', 'Proof of income', 'Proof of California residency', 'Social Security Number'],
    ARRAY['medicaid', 'health insurance', 'low-income', 'seniors']
  ),
  (
    'In-Home Supportive Services (IHSS)',
    'IHSS provides assistance to eligible elderly, blind, and disabled individuals who are unable to remain safely in their homes without help.',
    'California Department of Social Services',
    'caregiving',
    'California',
    'Los Angeles County',
    '1-888-944-4477',
    'https://www.cdss.ca.gov/in-home-supportive-services',
    'Must be 65 years or older, blind, or disabled and meet income requirements.',
    ARRAY['Medi-Cal eligibility', 'Medical verification of need', 'Proof of residence'],
    ARRAY['home care', 'elderly', 'disabled', 'caregiving']
  ),
  (
    'Texas Health and Human Services Commission (HHSC)',
    E'HHSC provides health coverage through programs such as Medicaid and the Children\'s Health Insurance Program (CHIP).',
    'Texas Health and Human Services',
    'healthcare',
    'Texas',
    NULL,
    '1-877-541-7905',
    'https://www.hhs.texas.gov/',
    'Varies by program, generally based on income, age, and disability status.',
    ARRAY['Proof of identity', 'Proof of income', 'Proof of Texas residency', 'Social Security Number'],
    ARRAY['medicaid', 'health insurance', 'seniors', 'disability']
  ),
  (
    'Community Care for the Elderly (CCE)',
    'Provides community-based services to help frail elders remain in their homes, avoiding or delaying nursing home placement.',
    'California Department of Aging',
    'community',
    'California',
    'San Mateo County',
    '1-800-675-8437',
    'https://aging.ca.gov/Programs_and_Services/',
    'Age 60 or older and functionally impaired.',
    ARRAY['Proof of age', 'Proof of residence', 'Medical assessment'],
    ARRAY['elderly', 'home care', 'community services']
  ),
  (
    'STAR+PLUS Waiver Program',
    'Provides home and community-based services to people who are elderly or have disabilities as an alternative to nursing facility care.',
    'Texas Health and Human Services',
    'healthcare',
    'Texas',
    'Travis County',
    '1-877-782-6440',
    'https://www.hhs.texas.gov/services/health/medicaid-chip/programs-services/starplus',
    'Must be eligible for Medicaid, age 21 or older, and meet nursing facility level of care criteria.',
    ARRAY['Medicaid eligibility', 'Medical assessment', 'Proof of residence'],
    ARRAY['medicaid', 'waiver', 'home care', 'elderly', 'disabled']
  ),
  (
    'California Low Income Home Energy Assistance Program (LIHEAP)',
    'Provides financial assistance to help low-income households meet their home energy needs.',
    'California Department of Community Services and Development',
    'financial',
    'California',
    NULL,
    '1-866-675-6623',
    'https://www.csd.ca.gov/Pages/LIHEAP.aspx',
    'Income-based eligibility, priority given to elderly, disabled, and households with children under 5.',
    ARRAY['Proof of income', 'Energy bills', 'Proof of residence'],
    ARRAY['utility assistance', 'energy bills', 'financial aid']
  ),
  (
    'Area Agency on Aging of the Capital Area (AAACAP)',
    'Provides services and supports for older adults and their caregivers in the Capital Area of Texas.',
    'Capital Area Council of Governments',
    'community',
    'Texas',
    'Travis County',
    '1-888-622-9111',
    'https://www.capcog.org/divisions/area-agency-on-aging',
    'Age 60 or older, or caregivers of older adults.',
    NULL,
    ARRAY['elderly', 'caregiving', 'community services']
  ),
  (
    'Supplemental Security Income (SSI)',
    'Federal income supplement program designed to help aged, blind, and disabled people who have little or no income.',
    'Social Security Administration',
    'financial',
    'California',
    NULL,
    '1-800-772-1213',
    'https://www.ssa.gov/ssi/',
    'Age 65 or older, blind, or disabled with limited income and resources.',
    ARRAY['Proof of identity', 'Proof of income and resources', 'Medical records (if applying based on disability)'],
    ARRAY['disability', 'financial aid', 'federal program']
  ),
  (
    'Medicare Savings Programs',
    'Help pay for Medicare premiums, deductibles, coinsurance, and copayments for people with limited income and resources.',
    'Centers for Medicare & Medicaid Services',
    'insurance',
    'Texas',
    NULL,
    '1-800-633-4227',
    'https://www.medicare.gov/your-medicare-costs/get-help-paying-costs/medicare-savings-programs',
    'Must be eligible for Medicare Part A and meet income and resource limits.',
    ARRAY['Medicare card', 'Proof of income', 'Proof of resources'],
    ARRAY['medicare', 'insurance', 'financial aid']
  ),
  (
    'Senior Community Service Employment Program (SCSEP)',
    'Provides part-time job training and employment opportunities for low-income adults age 55 and older.',
    'California Department of Aging',
    'financial',
    'California',
    'Los Angeles County',
    '1-916-419-7500',
    'https://aging.ca.gov/Programs_and_Services/Senior_Community_Service_Employment_Program/',
    'Age 55 or older, unemployed, and have a family income of no more than 125% of the federal poverty level.',
    ARRAY['Proof of age', 'Proof of income', 'Proof of residence'],
    ARRAY['employment', 'job training', 'seniors']
  );